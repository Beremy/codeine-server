var express = require("express");
var router = express.Router();
const statsController = require("../controllers/statsController");
const { adminAuthMiddleware, userAuthMiddleware } = require("../middleware/authMiddleware");

// Stats page
router.get("/getTotalUsers", statsController.getTotalUsersCount);
router.get("/getUserAnnotations", userAuthMiddleware, statsController.getUserAnnotationsCount);
router.get("/getTotalAnnotations", statsController.getTotalAnnotationsCount);

// User
router.get("/getUserRegistrationsDate", adminAuthMiddleware, statsController.getUserRegistrationsDate);
router.get('/getCumulativeUserRegistrations', adminAuthMiddleware, statsController.getCumulativeUserRegistrations);
router.get('/getUserTypesCount', adminAuthMiddleware, statsController.getUserTypesCount);

// All games
router.get("/getCumulativeAnnotationsGames", adminAuthMiddleware, statsController.getCumulativeAnnotationsGames);

// Text rating 
router.get("/getRatingPlausibilityDate", adminAuthMiddleware, statsController.getRatingPlausibilityDate);
router.get('/getCumulativeRatingPlausibility', adminAuthMiddleware, statsController.getCumulativeRatingPlausibility);

// UserErrorDetail
router.get("/getUserErrorDetailDate", adminAuthMiddleware, statsController.getUserErrorDetailDate);
router.get('/getCumulativeUserErrorDetail', adminAuthMiddleware, statsController.getCumulativeUserErrorDetail);

// UserTypingErrors
router.get("/getUserTypingErrorsDate", adminAuthMiddleware, statsController.getUserTypingErrorsDate);
router.get('/getCumulativeUserTypingErrors', adminAuthMiddleware, statsController.getCumulativeUserTypingErrors);

// UserSentenceSpecification
router.get("/getUserSentenceSpecificationDate", adminAuthMiddleware, statsController.getUserSentenceSpecificationDate);
router.get('/getCumulativeUserSentenceSpecification', adminAuthMiddleware, statsController.getCumulativeUserSentenceSpecification);


module.exports = router;
