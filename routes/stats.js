var express = require("express");
var router = express.Router();
const statsController = require("../controllers/statsController");
const { adminAuthMiddleware } = require("../middleware/authMiddleware");

// TODO Mettre les adminMiddleware quand token permanent

// User
// router.get("/getUserRegistrationsDate", adminAuthMiddleware, statsController.getUserRegistrationsDate);
router.get("/getUserRegistrationsDate", statsController.getUserRegistrationsDate);
router.get('/getCumulativeUserRegistrations', statsController.getCumulativeUserRegistrations);

// All games
router.get("/getCumulativeAnnotationsGames", statsController.getCumulativeAnnotationsGames);

// Text rating 
router.get("/getRatingPlausibilityDate", statsController.getRatingPlausibilityDate);
router.get('/getCumulativeRatingPlausibility', statsController.getCumulativeRatingPlausibility);

// UserErrorDetail
router.get("/getUserErrorDetailDate", statsController.getUserErrorDetailDate);
router.get('/getCumulativeUserErrorDetail', statsController.getCumulativeUserErrorDetail);

// UserTypingErrors
router.get("/getUserTypingErrorsDate", statsController.getUserTypingErrorsDate);
router.get('/getCumulativeUserTypingErrors', statsController.getCumulativeUserTypingErrors);

// UserSentenceSpecification
router.get("/getUserSentenceSpecificationDate", statsController.getUserSentenceSpecificationDate);
router.get('/getCumulativeUserSentenceSpecification', statsController.getCumulativeUserSentenceSpecification);


module.exports = router;
