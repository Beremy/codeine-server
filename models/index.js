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
const TestPlausibilityErrorModel = require("./testPlausibilityError.js");
const UserTextRatingModel = require("./userTextRating.js");
const ErrorAggregationModel = require("./errorAggregation.js");
const UserPlayedErrorsModel = require("./userPlayedErrors.js");
const ErrorTypeModel = require("./errorType.js");
const UserTypingResponsesModel = require("./userTypingResponses.js");
const CriminalModel = require("./criminal.js");
const UserCriminalModel = require("./userCriminal");
const MessageContactModel = require("./messageContact.js");

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
const TestPlausibilityError = TestPlausibilityErrorModel(
  sequelize,
  Sequelize.DataTypes
);
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
const ErrorAggregation = ErrorAggregationModel(sequelize, Sequelize.DataTypes);
const UserPlayedErrors = UserPlayedErrorsModel(sequelize, Sequelize.DataTypes);
const ErrorType = ErrorTypeModel(sequelize, Sequelize.DataTypes);
const UserTypingResponses = UserTypingResponsesModel(
  sequelize,
  Sequelize.DataTypes
);
const Criminal = CriminalModel(sequelize, Sequelize.DataTypes);
const UserCriminal = UserCriminalModel(sequelize, Sequelize.DataTypes);
const MessageContact = MessageContactModel(sequelize, Sequelize.DataTypes);

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
  TestSpecification: TestSpecification,
  UserTextRating: UserTextRating,
  ErrorAggregation: ErrorAggregation,
  UserPlayedErrors: UserPlayedErrors,
  ErrorType: ErrorType,
  UserTypingResponses: UserTypingResponses,
  Criminal: Criminal,
  UserCriminal: UserCriminal,
  Game: Game,
  UserTutorial: UserTutorial,
  MessageContact: MessageContact,
};

// *************** Associations User & MessageContact *******************
MessageContact.belongsTo(User, {
  foreignKey: "user_id",
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

// *************** Associations UserTypingResponses *******************
User.belongsToMany(ErrorType, {
  through: UserTypingResponses,
  foreignKey: "user_id",
});
ErrorType.belongsToMany(User, {
  through: UserTypingResponses,
  foreignKey: "error_type_id",
});

ErrorAggregation.hasMany(UserTypingResponses, {
  foreignKey: "error_aggregation_id",
  sourceKey: "id",
});
UserTypingResponses.belongsTo(ErrorAggregation, {
  foreignKey: "error_aggregation_id",
  targetKey: "id",
});

// *************** Associations UserPlayedErrors *******************
ErrorAggregation.hasMany(UserPlayedErrors, {
  foreignKey: "error_aggregation_id",
  sourceKey: "id",
});
UserPlayedErrors.belongsTo(ErrorAggregation, {
  foreignKey: "error_aggregation_id",
  targetKey: "id",
});

// *************** Associations ErrorAggregation *******************
ErrorAggregation.belongsTo(Text, {
  foreignKey: "text_id",
  targetKey: "id",
});
Text.hasMany(ErrorAggregation, {
  foreignKey: "text_id",
  sourceKey: "id",
});
ErrorAggregation.hasMany(UserPlayedErrors, {
  foreignKey: "error_aggregation_id",
  sourceKey: "id",
});

ErrorAggregation.belongsTo(ErrorType, {
  foreignKey: "error_type_id",
  targetKey: "id",
});

ErrorType.hasMany(ErrorAggregation, {
  foreignKey: "error_type_id",
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

// *************** Associations TestSpecification *******************
Text.hasMany(TestSpecification, {
  foreignKey: "text_id",
  sourceKey: "id",
});
TestSpecification.belongsTo(Text, {
  foreignKey: "text_id",
  targetKey: "id",
});

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
