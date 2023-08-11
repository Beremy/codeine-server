require("dotenv").config();
const { Sequelize } = require("sequelize");
const { sequelize } = require("../service/db");

const AchievementModel = require("./achievement.js");
const SkinModel = require("./skin.js");
const UserModel = require("./user.js");
const AdminModel = require("./admin.js");
const TextModel = require("./text.js");
const ThemeModel = require("./theme.js");
const SentenceModel = require("./sentence.js");
const MessageMenuModel = require("./messageMenu.js");
const UserSentenceSpecificationModel = require("./userSentenceSpecification");
const TokenModel = require("./token.js");
const TestPlausibilityErrorModel = require("./testPlausibilityError.js");

const TestPlausibilityError = TestPlausibilityErrorModel(
  sequelize,
  Sequelize.DataTypes
);
const UserGameTextModel = require("./userGameText.js");
const UserGameText = UserGameTextModel(sequelize, Sequelize.DataTypes);
const Token = TokenModel(sequelize, Sequelize.DataTypes);
const UserAchievement = require("./userAchievement.js")(
  sequelize,
  Sequelize.DataTypes
);
const UserSkin = require("./userSkin.js")(sequelize, Sequelize.DataTypes);
const Achievement = AchievementModel(sequelize, Sequelize.DataTypes);
const Skin = SkinModel(sequelize, Sequelize.DataTypes);
const User = UserModel(sequelize, Sequelize.DataTypes);
const Admin = AdminModel(sequelize, Sequelize.DataTypes);
const Text = TextModel(sequelize, Sequelize.DataTypes);
const Theme = ThemeModel(sequelize, Sequelize.DataTypes);
const Sentence = SentenceModel(sequelize, Sequelize.DataTypes);
const UserSentenceSpecification = UserSentenceSpecificationModel(
  sequelize,
  Sequelize.DataTypes
);
const MessageMenu = MessageMenuModel(sequelize, Sequelize.DataTypes);

const models = {
  User: User,
  Admin: Admin,
  Achievement: Achievement,
  UserAchievement: UserAchievement,
  Skin: Skin,
  UserSkin: UserSkin,
  Text: Text,
  Theme: Theme,
  Sentence: Sentence,
  UserSentenceSpecification: UserSentenceSpecification,
  Token: Token,
  MessageMenu: MessageMenu,
  UserGameText: UserGameText,
  TestPlausibilityError: TestPlausibilityError,
};

// *************** Associations TestPlausibilityError *******************
Text.hasMany(TestPlausibilityError, {
  foreignKey: "text_id",
  sourceKey: "id",
});
TestPlausibilityError.belongsTo(Text, {
  foreignKey: "text_id",
  targetKey: "id",
});

// *************** Associations User_Game_Texts *******************
User.hasMany(UserGameText, {
  foreignKey: "user_id",
  sourceKey: "id",
});
UserGameText.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});

Text.hasMany(UserGameText, {
  foreignKey: "text_id",
  sourceKey: "id",
});
UserGameText.belongsTo(Text, {
  foreignKey: "text_id",
  targetKey: "id",
});

// *************** Associations TextToken *******************
Text.hasMany(Token, {
  foreignKey: "text_id",
  sourceKey: "id",
});
Token.belongsTo(Text, {
  foreignKey: "text_id",
  targetKey: "id",
});

// *************** Associations UserSkin *******************
User.belongsToMany(Skin, {
  through: UserSkin,
  foreignKey: "user_id",
  otherKey: "skin_id",
});
Skin.belongsToMany(User, {
  through: UserSkin,
  foreignKey: "skin_id",
  otherKey: "user_id",
});

User.hasMany(UserSkin, {
  foreignKey: "user_id",
  sourceKey: "id",
});
UserSkin.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});

Skin.hasMany(UserSkin, {
  foreignKey: "skin_id",
  sourceKey: "id",
});
UserSkin.belongsTo(Skin, {
  foreignKey: "skin_id",
  targetKey: "id",
});

// *************** Associations UserAchievement *******************
User.belongsToMany(Achievement, {
  through: UserAchievement,
  foreignKey: "user_id",
  otherKey: "achievement_id",
});
Achievement.belongsToMany(User, {
  through: UserAchievement,
  foreignKey: "achievement_id",
  otherKey: "user_id",
});

User.hasMany(UserAchievement, {
  foreignKey: "user_id",
  sourceKey: "id",
});
UserAchievement.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});

Achievement.hasMany(UserAchievement, {
  foreignKey: "achievement_id",
  sourceKey: "id",
});
UserAchievement.belongsTo(Achievement, {
  foreignKey: "achievement_id",
  targetKey: "id",
});

// *************** Associations UserSentenceSpecification *******************
Text.hasMany(Sentence, {
  foreignKey: "text_id",
  sourceKey: "id",
});
Sentence.belongsTo(Text, {
  foreignKey: "text_id",
  targetKey: "id",
});
User.hasMany(UserSentenceSpecification, {
  foreignKey: "user_id",
  sourceKey: "id",
});
UserSentenceSpecification.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});

Text.hasMany(UserSentenceSpecification, {
  foreignKey: "text_id",
  sourceKey: "id",
});
UserSentenceSpecification.belongsTo(Text, {
  foreignKey: "text_id",
  targetKey: "id",
});

sequelize.sync();

module.exports = models;
