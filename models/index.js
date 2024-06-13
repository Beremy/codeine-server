require("dotenv").config();
const { Sequelize } = require("sequelize");
const { sequelize } = require("../service/db");

const UserGameTextModel = require("./userGameText.js");
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
const UserTextRatingModel = require("./userTextRating.js");
const UserErrorDetailModel = require("./userErrorDetail.js");
const UserPlayedErrorsModel = require("./userPlayedErrors.js");
const ErrorTypeModel = require("./errorType.js");
const UserTypingErrorsModel = require("./userTypingErrors.js");
const CriminalModel = require("./criminal.js");
const UserCriminalModel = require("./userCriminal");
const MessageContactModel = require("./messageContact.js");
const PasswordResetTokenModel = require("./passwordResetToken.js");
const MonthlyWinnersModel = require("./monthlyWinners.js");
const TestPlausibilityErrorModel = require("./testPlausibilityError");
const GroupTextRatingModel = require("./groupTextRating");
const UserCommentsGroupTextRatingModel = require("./UserCommentsGroupTextRating");

const Game = require("./games.js")(sequelize, Sequelize.DataTypes);
const UserTutorial = require("./userTutorial.js")(
  sequelize,
  Sequelize.DataTypes
);
const TestSpecification = require("./testSpecification")(
  sequelize,
  Sequelize.DataTypes
);
const UserAchievement = require("./userAchievement.js")(
  sequelize,
  Sequelize.DataTypes
);
const UserSkin = require("./userSkin.js")(sequelize, Sequelize.DataTypes);
const UserGameText = UserGameTextModel(sequelize, Sequelize.DataTypes);
const Token = TokenModel(sequelize, Sequelize.DataTypes);
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
const UserTextRating = UserTextRatingModel(sequelize, Sequelize.DataTypes);
const UserPlayedErrors = UserPlayedErrorsModel(sequelize, Sequelize.DataTypes);
const ErrorType = ErrorTypeModel(sequelize, Sequelize.DataTypes);
const UserErrorDetail = UserErrorDetailModel(sequelize, Sequelize.DataTypes);
const UserTypingErrors = UserTypingErrorsModel(sequelize, Sequelize.DataTypes);
const Criminal = CriminalModel(sequelize, Sequelize.DataTypes);
const UserCriminal = UserCriminalModel(sequelize, Sequelize.DataTypes);
const MessageContact = MessageContactModel(sequelize, Sequelize.DataTypes);
const PasswordResetToken = PasswordResetTokenModel(
  sequelize,
  Sequelize.DataTypes
);
const MonthlyWinners = MonthlyWinnersModel(sequelize, Sequelize.DataTypes);
const TestPlausibilityError = TestPlausibilityErrorModel(
  sequelize,
  Sequelize.DataTypes
);
const GroupTextRating = GroupTextRatingModel(sequelize, Sequelize.DataTypes);
const UserCommentsGroupTextRating = UserCommentsGroupTextRatingModel(
  sequelize,
  Sequelize.DataTypes
);

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
  TestSpecification: TestSpecification,
  UserTextRating: UserTextRating,
  UserPlayedErrors: UserPlayedErrors,
  ErrorType: ErrorType,
  UserErrorDetail: UserErrorDetail,
  UserTypingErrors: UserTypingErrors,
  Criminal: Criminal,
  UserCriminal: UserCriminal,
  Game: Game,
  UserTutorial: UserTutorial,
  MessageContact: MessageContact,
  PasswordResetToken,
  MonthlyWinners,
  TestPlausibilityError,
  GroupTextRating,
  UserCommentsGroupTextRating,
};

// *************** Associations User & MonthlyWinners *******************
MonthlyWinners.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});

// *************** Associations PasswordResetToken *******************
PasswordResetToken.belongsTo(models.User, {
  foreignKey: "userId",
  targetKey: "id",
});

// *************** Associations User & MessageContact *******************
MessageContact.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});

// *************** Associations TestPlausibilityError & Text *******************
models.TestPlausibilityError.belongsTo(models.Text, {
  foreignKey: "text_id",
  targetKey: "id",
});

// *************** Associations User & Game via UserTutorial *******************
User.belongsToMany(Game, {
  through: UserTutorial,
  foreignKey: "user_id",
});
Game.belongsToMany(User, {
  through: UserTutorial,
  foreignKey: "game_id",
});

UserTutorial.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});
UserTutorial.belongsTo(Game, {
  foreignKey: "game_id",
  targetKey: "id",
});

// *************** Associations User & Criminal via UserCriminal *******************

User.belongsToMany(Criminal, {
  through: UserCriminal,
  foreignKey: "user_id",
});
Criminal.belongsToMany(User, {
  through: UserCriminal,
  foreignKey: "criminal_id",
});

UserCriminal.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});
UserCriminal.belongsTo(Criminal, {
  foreignKey: "criminal_id",
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

// *************** Associations UserTypingErrors *******************
User.belongsToMany(ErrorType, {
  through: UserTypingErrors,
  foreignKey: "user_id",
});
ErrorType.belongsToMany(User, {
  through: UserTypingErrors,
  foreignKey: "error_type_id",
});

UserErrorDetail.hasMany(UserTypingErrors, {
  foreignKey: "user_error_details_id",
  sourceKey: "id",
});
UserTypingErrors.belongsTo(UserErrorDetail, {
  foreignKey: "user_error_details_id",
  targetKey: "id",
});

// *************** Associations UserPlayedErrors *******************
UserErrorDetail.hasMany(UserPlayedErrors, {
  foreignKey: "user_error_details_id",
  sourceKey: "id",
});
UserPlayedErrors.belongsTo(UserErrorDetail, {
  foreignKey: "user_error_details_id",
  targetKey: "id",
});
// *************** Associations UserErrorDetail *******************
UserErrorDetail.belongsTo(Text, {
  foreignKey: "text_id",
  targetKey: "id",
});

Text.hasMany(UserErrorDetail, {
  foreignKey: "text_id",
  sourceKey: "id",
});
UserErrorDetail.belongsTo(ErrorType, {
  foreignKey: "test_error_type_id",
  targetKey: "id",
});

ErrorType.hasMany(UserErrorDetail, {
  foreignKey: "test_error_type_id",
  sourceKey: "id",
});

// *************** Associations UserTextRating *******************
User.hasMany(UserTextRating, {
  foreignKey: "user_id",
  sourceKey: "id",
});
UserTextRating.belongsTo(User, {
  foreignKey: "user_id",
  targetKey: "id",
});

Text.hasMany(UserTextRating, {
  foreignKey: "text_id",
  sourceKey: "id",
});
UserTextRating.belongsTo(Text, {
  foreignKey: "text_id",
  targetKey: "id",
});

UserTextRating.belongsTo(GroupTextRating, {
  foreignKey: "group_id",
});

// *************** Associations UserCommentsGroupTextRating *******************
User.hasMany(UserCommentsGroupTextRating, { foreignKey: "user_id" });

Text.hasMany(GroupTextRating, { foreignKey: "text_id" });

GroupTextRating.hasMany(UserTextRating, { foreignKey: "group_id" });

GroupTextRating.hasMany(UserCommentsGroupTextRating, {
  foreignKey: "group_id",
});

UserCommentsGroupTextRating.belongsTo(User, { foreignKey: "user_id" });
UserCommentsGroupTextRating.belongsTo(GroupTextRating, {
  foreignKey: "group_id",
});
GroupTextRating.belongsTo(Text, {
  foreignKey: 'text_id',
  targetKey: 'id'
});

// *************** Associations TestSpecification *******************
Text.hasMany(TestSpecification, {
  foreignKey: "text_id",
  sourceKey: "id",
});
TestSpecification.belongsTo(Text, {
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

// Association entre Sentence et Token
Sentence.hasMany(Token, {
  foreignKey: "sentence_id",
  sourceKey: "id",
});
Token.belongsTo(Sentence, {
  foreignKey: "sentence_id",
  targetKey: "id",
});

// Association entre Text et Sentence
Text.hasMany(Sentence, {
  foreignKey: "text_id",
  sourceKey: "id",
});
Sentence.belongsTo(Text, {
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
