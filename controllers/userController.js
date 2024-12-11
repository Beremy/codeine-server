const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const {
  User,
  Achievement,
  UserSkin,
  MonthlyWinners,
  Skin,
  RefreshToken,
} = require("../models");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../service/db.js");
const moment = require("moment");
const { Op } = require("sequelize");
const skinOrder = [
  "personnage",
  "Vestes",
  "Accessoires",
  "Visages",
  "Cheveux",
  "Chapeaux",
  "Lunettes",
];
const { getRandomSkin } = require("../controllers/skinsController");

const createUser = async (user) => {
  const transaction = await sequelize.transaction();
  try {
    user.password = await bcrypt.hash(user.password, 10);
    const newUser = await User.create(user, { transaction });

    let faceId, hairId;

    if (user.gender === "homme") {
      switch (user.color_skin) {
        case "medium":
          faceId = 170;
          hairId = 215;
          break;
        case "dark":
          faceId = 171;
          hairId = 216;
          break;
        case "clear":
          faceId = 172;
          hairId = 217;
          break;
        default:
          break;
      }
    } else {
      switch (user.color_skin) {
        case "medium":
          faceId = 187;
          hairId = 221;
          break;
        case "dark":
          faceId = 188;
          hairId = 222;
          break;
        case "clear":
          faceId = 189;
          hairId = 223;
          break;
        default:
          break;
      }
    }

    await UserSkin.bulkCreate(
      [
        { user_id: newUser.id, skin_id: faceId, equipped: true },
        { user_id: newUser.id, skin_id: hairId, equipped: true },
      ],
      { transaction }
    );

    await transaction.commit();

    return newUser;
  } catch (error) {
    await transaction.rollback();
    console.error(error);
    throw error;
  }
};

const signup = async (req, res) => {
  try {
    // Convertit une chaîne vide en null pour éviter le "mail déjà" pris quand l'user ne la précise pas
    const email =
      req.body.email && req.body.email.trim() !== ""
        ? req.body.email.trim()
        : null;

    if (email) {
      const existingUserByEmail = await User.findOne({
        where: { email },
      });

      if (existingUserByEmail) {
        return res
          .status(409)
          .json({ error: "Cette adresse email est déjà utilisée." });
      }
    }

    const newUserDetails = {
      ...req.body,
      email: email,
      moderator: false,
    };

    const user = await createUser(newUserDetails);
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });
    const userInfo = user.get({ plain: true });
    delete userInfo.password;
    res
      .status(201)
      .json({ message: "User created successfully", token, user: userInfo });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      res.status(409).json({ error: "Ce nom d'utilisateur est déjà pris." });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

const getUserByUsername = async (username) => {
  return await User.findOne({ where: { username } });
};

const getUserByEmail = async (email) => {
  return await User.findOne({
    where: { email: email },
  });
};

async function getUserByUsernameOrEmail(identifier) {
  let user = await getUserByUsername(identifier);
  if (user) return user;
  user = await getUserByEmail(identifier);
  return user;
}

const signin = async (req, res) => {
  try {
    const user = await getUserByUsernameOrEmail(req.body.username);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
    // TODO Refresh token a revoir
    // const accessToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    //   expiresIn: '24h'
    // });

    // const refreshToken = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_REFRESH_SECRET, {
    //   expiresIn: '7d'
    // });
    // await RefreshToken.create({
    //   user_id: user.id,
    //   token: refreshToken,
    //   expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
    // });

    const token = jwt.sign(
      { id: user.id, moderator: user.moderator },
      process.env.JWT_SECRET
      // { expiresIn: "24h" }
    );

    const userInfo = user.get({ plain: true });
    delete userInfo.password;
    res.status(200).json({
      message: "User signed in successfully",
      token,
      // accessToken,
      // refreshToken,
      user: userInfo,
    });
  } catch (error) {
    console.error("An error occurred while updating user coeffMulti:", error);
    res.status(500).json({ error: error.message });
  }
};

const editUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await User.update(req.body, {
      where: {
        id: userId,
      },
    });
    res.status(200).send(user);
  } catch (error) {
    console.error("Erreur dans la mise à jour de l'utilisateur:", error);
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["username"]],
      attributes: { exclude: ["password", "notifications_enabled"] },
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsersOrderedByPoints = async (req, res) => {
  const limit = 20;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  try {
    const users = await User.findAll({
      order: [["points", "DESC"]],
      limit,
      offset,
      attributes: ["id", "username", "points", "nb_first_monthly"],
    });
    let lastPoints = null;
    let lastRank = 0;
    // Ajouter la position à chaque utilisateur
    const usersWithRank = users.map((user, index) => {
      const userPlain = user.get({ plain: true });
      if (lastPoints !== userPlain.points) {
        lastRank = offset + index + 1;
        lastPoints = userPlain.points;
      }

      return {
        ...userPlain,
        ranking: lastRank,
      };
    });

    res.status(200).json(usersWithRank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUsersOrderedByPointsInMonthly = async (req, res) => {
  const limit = 20;
  const page = req.query.page || 1;
  const offset = (page - 1) * limit;

  try {
    const users = await User.findAll({
      order: [["monthly_points", "DESC"]],
      limit,
      offset,
      attributes: ["id", "username", "monthly_points", "nb_first_monthly"],
    });
    let lastPoints = null;
    let lastRank = 0;
    // Ajouter la position à chaque utilisateur
    const usersWithRank = users.map((user, index) => {
      const userPlain = user.get({ plain: true });
      if (lastPoints !== userPlain.monthly_points) {
        lastRank = offset + index + 1;
        lastPoints = userPlain.monthly_points;
      }

      return {
        ...userPlain,
        ranking: lastRank,
      };
    });

    res.status(200).json(usersWithRank);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

async function getUserRankingById(userId) {
  const rankings = await User.sequelize.query(
    "SELECT id, RANK() OVER (ORDER BY points DESC) as ranking FROM users",
    { type: QueryTypes.SELECT }
  );
  const userRanking = rankings.find((ranking) => ranking.id === userId);
  return userRanking.ranking;
}

const getUserRanking = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const userRanking = await getUserRankingById(userId);
    res.status(200).json({ ranking: userRanking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

const getUserRankingRange = async (req, res) => {
  const userId = parseInt(req.params.id);
  const range = 1; // Nombre d'utilisateurs à inclure avant et après l'utilisateur

  try {
    const rankings = await User.sequelize.query(
      "SELECT id, username, points, RANK() OVER (ORDER BY points DESC) as ranking FROM users",
      { type: QueryTypes.SELECT }
    );

    const userRankingIndex = rankings.findIndex(
      (ranking) => ranking.id === userId
    );

    if (userRankingIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    let start, end;
    if (userRankingIndex === 0) {
      // Si l'utilisateur est en premier rang
      start = 0;
      end = start + 2 * range + 1;
    } else if (userRankingIndex === rankings.length - 1) {
      // Si l'utilisateur est en dernier rang
      end = rankings.length;
      start = end - 2 * range - 1;
    } else {
      // Pour tous les autres rangs
      start = Math.max(0, userRankingIndex - range);
      end = Math.min(rankings.length, userRankingIndex + range + 1);
    }

    const rankingRange = rankings.slice(start, end);

    res.status(200).json(rankingRange);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserRankingRangeInMonthly = async (req, res) => {
  const userId = parseInt(req.params.id);
  const range = 1;

  try {
    const rankings = await User.sequelize.query(
      "SELECT id, username, monthly_points, RANK() OVER (ORDER BY monthly_points DESC) as ranking FROM users",
      { type: QueryTypes.SELECT }
    );

    const userRankingIndex = rankings.findIndex(
      (ranking) => ranking.id === userId
    );

    if (userRankingIndex === -1) {
      return res.status(404).json({ error: "User not found" });
    }

    let start, end;
    if (userRankingIndex === 0) {
      start = 0;
      end = start + 2 * range + 1;
    } else if (userRankingIndex === rankings.length - 1) {
      end = rankings.length;
      start = end - 2 * range - 1;
    } else {
      start = Math.max(0, userRankingIndex - range);
      end = Math.min(rankings.length, userRankingIndex + range + 1);
    }

    const rankingRange = rankings.slice(start, end);

    res.status(200).json(rankingRange);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTopMonthlyWinners = async (req, res) => {
  try {
    const topWinners = await MonthlyWinners.findAll({
      limit: 3,
      order: [["ranking", "ASC"]],
      attributes: ["user_id", "username", "points", "ranking"],
      include: [
        {
          model: User,
          attributes: ["gender", "color_skin"],
        },
      ],
    });

    // Skins équipés des gagnants
    for (let winner of topWinners) {
      const equippedSkins = await UserSkin.findAll({
        where: { user_id: winner.user_id, equipped: true },
        include: [
          {
            model: Skin,
          },
        ],
      });
      const sortedSkins = equippedSkins
        .map((ua) => ua.skin)
        .sort((a, b) => skinOrder.indexOf(a.type) - skinOrder.indexOf(b.type));

      winner.dataValues.equippedSkins = sortedSkins;
    }

    res.status(200).json(topWinners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ["password", "notifications_enabled"] },
    });
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw new Error("Failed to fetch user");
  }
};

async function updateUserCoeffMulti(user, transaction) {
  try {
    const userAchievements = await user.getAchievements({
      transaction: transaction,
    });
    const achievementCount = userAchievements.length;

    const newCoeffMulti = parseFloat((1.0 + achievementCount * 0.1).toFixed(1));

    await user.update(
      { coeffMulti: newCoeffMulti },
      { transaction: transaction }
    );
  } catch (err) {
    console.error("An error occurred while updating user coeffMulti:", err);
    throw err;
  }
}

async function checkAchievements(user, transaction) {
  try {
    const scoreAchievements = [
      { id: "2", score: 100 },
      { id: "3", score: 500 },
      { id: "4", score: 1000 },
      { id: "5", score: 5000 },
      { id: "6", score: 10000 },
    ];

    const consecutiveDayAchievements = [
      { id: "15", days: 7 },
      { id: "16", days: 30 },
      { id: "17", days: 60 },
    ];

    let newAchievements = [];

    // Vérification des hauts faits liés au score
    for (const achievement of scoreAchievements) {
      const existingAchievement = await user.getAchievements({
        where: { id: achievement.id },
        transaction: transaction,
      });
      if (
        existingAchievement.length === 0 &&
        user.points >= achievement.score
      ) {
        const newAchievement = await Achievement.findByPk(achievement.id, {
          transaction: transaction,
        });
        if (newAchievement) {
          await user.addAchievement(newAchievement, {
            through: { notified: false },
            transaction: transaction,
          });
          newAchievements.push(newAchievement);
        }
      }
    }

    // Vérification des hauts faits liés aux jours consécutifs
    for (const achievement of consecutiveDayAchievements) {
      const existingAchievement = await user.getAchievements({
        where: { id: achievement.id },
        transaction: transaction,
      });
      if (
        existingAchievement.length === 0 &&
        user.consecutiveDaysPlayed >= achievement.days
      ) {
        const newAchievement = await Achievement.findByPk(achievement.id, {
          transaction: transaction,
        });
        if (newAchievement) {
          await user.addAchievement(newAchievement, {
            through: { notified: false },
            transaction: transaction,
          });
          newAchievements.push(newAchievement);
        }
      }
    }

    // Haut fait de déblocage de tous les skins
    const allSkinsAchievementId = "28";
    const existingAllSkinsAchievement = await user.getAchievements({
      where: { id: allSkinsAchievementId },
      transaction: transaction,
    });
    if (existingAllSkinsAchievement.length === 0) {
      const genderSpecificConditions = {
        where: {
          [Op.or]: [{ gender: user.gender }, { gender: "unisexe" }],
        },
        transaction: transaction,
      };
      const totalSkins = await Skin.count(genderSpecificConditions);
      const userSkins = await user.getUser_skins({
        distinct: true,
        col: "skin_id",
        transaction: transaction,
      });

      if (userSkins.length >= totalSkins) {
        const allSkinsAchievement = await Achievement.findByPk(
          allSkinsAchievementId,
          { transaction: transaction }
        );
        if (allSkinsAchievement) {
          await user.addAchievement(allSkinsAchievement, {
            through: { notified: false },
            transaction: transaction,
          });
          newAchievements.push(allSkinsAchievement);
        }
      }
    }

    if (newAchievements.length > 0) {
      // Assuming updateUserCoeffMulti also handles transactions
      await updateUserCoeffMulti(user, transaction);
    }

    return newAchievements;
  } catch (err) {
    console.error("An error occurred while checking achievements:", err);
    throw err;
  }
}

const incrementTutorialProgress = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findOne({ where: userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.tutorial_progress++;
    await user.save();
    const newTutorialProgress = user.tutorial_progress;
    return res.status(200).json({ newTutorialProgress });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const incrementUserPoints = async (req, res) => {
  // Pas utile pour le moment
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.points += req.body.points;
    await user.save();
    const newPoints = user.points;
    const newAchievements = await checkAchievements(user);
    return res.status(200).json({ newPoints, newAchievements });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const incrementCatchProbability = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.catch_probability = Math.min(
      100,
      Math.max(0, user.catch_probability - 15)
    );
    await user.save();

    return res
      .status(200)
      .json({ newCatchProbability: user.catch_probability });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const incrementTrustIndex = async (req, res) => {
  const { id } = req.params;
  const { trust_index } = req.body;
  try {
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.trust_index = Math.min(
      100,
      Math.max(0, user.trust_index + trust_index)
    );
    await user.save();

    return res.status(200).json({ newTrustIndex: user.trust_index });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserTrustIndex = async (userId, increment) => {
  const user = await User.findByPk(userId);
  user.trust_index += increment;
  await user.save();
};

const updateUserStats = async (
  userId,
  pointsToAdd,
  percentageToAdd,
  trustIndexIncrement,
  transaction,
  isPenalty = false
) => {
  try {
    const user = await User.findOne({
      where: { id: userId },
      transaction: transaction,
    });
    if (!user) {
      throw new Error("User not found");
    }

    const userCriminals = await user.getCriminals();
    const criminalsCount = userCriminals.length;
    const userTrust = user.trust_index;
    let adjustedPercentageToAdd = 0;

    // Si malus, on ne prend pas en compte le nb de criminels arrêtés
    if (!isPenalty) {
      if (userTrust < 30) {
        adjustedPercentageToAdd = 0;
      } else if (userTrust > 30) {
        const decayRate = 0.14;
        adjustedPercentageToAdd =
          percentageToAdd * Math.exp(-decayRate * criminalsCount);
      }
    } else {
      adjustedPercentageToAdd = percentageToAdd;
    }

    const oldRewardTier = Math.floor(user.points / 100);

    let coeffTrustIndex = user.trust_index / 80;
    coeffTrustIndex = Math.max(coeffTrustIndex, 0);
    let additionalPoints = Math.round(
      pointsToAdd * coeffTrustIndex * user.coeffMulti
    );

    // On ajoute les points supplémentaires si tous les skins sont débloqués
    const newRewardTier = Math.floor((user.points + additionalPoints) / 100);
    if (newRewardTier > oldRewardTier) {
      const skinResponse = await getRandomSkin(user.id, transaction);
      if (skinResponse.allSkinsUnlocked) {
        additionalPoints += 5;
      }
    }

    user.points += additionalPoints;
    user.monthly_points += additionalPoints;

    // Convertir user.catch_probability en nombre si nécessaire
    let currentCatchProbability = parseFloat(user.catch_probability);
    if (isNaN(currentCatchProbability)) {
      currentCatchProbability = 0;
    }

    user.catch_probability = Math.min(
      100,
      Math.max(0, currentCatchProbability + adjustedPercentageToAdd)
    );

    user.trust_index = Math.min(
      100,
      Math.max(0, user.trust_index + parseFloat(trustIndexIncrement))
    );

    // Gestion des jours consécutifs joués
    const today = new Date();
    const lastPlayedDate = user.lastPlayedDate
      ? new Date(user.lastPlayedDate)
      : null;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const formatDate = (date) => date.toISOString().slice(0, 10);

    if (
      lastPlayedDate &&
      formatDate(lastPlayedDate) === formatDate(yesterday)
    ) {
      user.consecutiveDaysPlayed = (user.consecutiveDaysPlayed || 0) + 1;
    } else if (
      !lastPlayedDate ||
      formatDate(lastPlayedDate) !== formatDate(today)
    ) {
      user.consecutiveDaysPlayed = 1;
    }

    user.lastPlayedDate = formatDate(today);
    await user.save({ transaction: transaction });

    let showSkinModal = false;
    let skinData = null;

    if (newRewardTier > oldRewardTier) {
      const skinResponse = await getRandomSkin(user.id, transaction);
      showSkinModal = true;
      skinData = skinResponse;
    }
    const newAchievements = await checkAchievements(user, transaction);

    return {
      newPoints: user.points,
      newCatchProbability: Math.round(parseFloat(user.catch_probability)), // Arrondi à l'entier
      newTrustIndex: user.trust_index,
      newCoeffMulti: user.coeffMulti,
      newAchievements,
      showSkinModal,
      skinData,
    };
  } catch (error) {
    console.error(error.message);
    throw new Error("Error updating user stats: " + error.message);
  }
};

const resetCatchProbability = async (req, res) => {
  const { id } = req.user.id;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.catch_probability = 0;
    await user.save();

    return res.status(200).json({ catchProbability: user.catchProbability });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCoeffMultiByUserId = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    const user = await User.findOne({
      attributes: ["coeffMulti"],
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const coeffMulti = parseFloat(user.coeffMulti);
    res.status(200).json({ coeffMulti });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessageReadByUserId = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await User.findOne({
      attributes: ["message_read"],
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json({ hasBeenRead: user.message_read });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateMessageReadByUserId = async (req, res) => {
  const userId = req.user.id;
  const { readStatus } = req.body;

  try {
    const user = await User.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    user.message_read = readStatus;
    await user.save();

    return res
      .status(200)
      .json({ message: `User read status updated to ${readStatus}.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserDetailsById = async (req, res) => {
  const userId = parseInt(req.params.id);

  try {
    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID" });
    }

    const generalRanking = await getUserRankingById(userId);
    const monthlyRankings = await User.sequelize.query(
      "SELECT id, RANK() OVER (ORDER BY monthly_points DESC) as ranking FROM users",
      { type: QueryTypes.SELECT }
    );
    const monthlyRanking =
      monthlyRankings.find((r) => r.id === userId)?.ranking || -1;

    // Récupérer le nombre de fois où l'utilisateur a été 1er au classement mensuel
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const userName = user.username;
    const userPoints = user.points;
    const nbFirstMonthly = user.nb_first_monthly;
    const userGender = user.gender;
    const userColorSkin = user.color_skin;

    // Date de création
    createdAt = moment(user.created_at).locale("fr").format("DD MMMM YYYY");

    // Récupérer le nombre de hauts faits accomplis par l'utilisateur
    const userAchievements = await user.getAchievements();
    const achievementCount = userAchievements.length;

    const userCriminals = await user.getCriminals();
    const criminalsCount = userCriminals.length;

    res.status(200).json({
      userName,
      userPoints,
      generalRanking: generalRanking,
      monthlyRanking,
      nbFirstMonthly,
      achievementCount,
      criminalsCount,
      createdAt,
      userGender,
      userColorSkin,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserEmail = async (req, res, next) => {
  const userId = req.user.id;
  const { email } = req.body;

  if (!email) {
    return res.status(400).send("Email is required");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return res.status(400).send("Invalid email format");
  }

  try {
    // Vérifie si l'email est déjà utilisé par un autre utilisateur
    const emailExists = await User.findOne({ where: { email } });
    if (emailExists) {
      return res.status(409).send("Email already in use");
    }

    await User.update(
      { email },
      {
        where: {
          id: userId,
        },
      }
    );

    res.status(200).send("Email updated");
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  signin,
  getAllUsers,
  editUser,
  getUserById,
  getUserByEmail,
  getUsersOrderedByPoints,
  getUsersOrderedByPointsInMonthly,
  getUserRanking,
  getUserRankingRange,
  getUserRankingRangeInMonthly,
  incrementUserPoints,
  incrementCatchProbability,
  incrementTrustIndex,
  resetCatchProbability,
  updateUserStats,
  updateUserCoeffMulti,
  getCoeffMultiByUserId,
  getMessageReadByUserId,
  updateMessageReadByUserId,
  updateUserEmail,
  getTopMonthlyWinners,
  incrementTutorialProgress,
  getUserDetailsById,
  incrementCatchProbability,
};
