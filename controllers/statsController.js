const { startOfWeek, addWeeks, format } = require("date-fns");
const {
  User,
  UserTextRating,
  UserErrorDetail,
  UserTypingErrors,
  UserSentenceSpecification,
} = require("../models");
const { sequelize } = require("../service/db.js");

const generateWeeklySeries = (startDate, endDate) => {
  let dates = [];
  let currentDate = startOfWeek(new Date(startDate), { weekStartsOn: 1 });
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push({
      week: format(currentDate, "yyyyww"),
      date: format(currentDate, "dd MMM yyyy"),
      count: 0,
    });
    currentDate = addWeeks(currentDate, 1);
  }
  return dates;
};

// **************** User ****************
const getUserRegistrationsDate = async (req, res) => {
  try {
    const earliest = await User.min("created_at");
    const latest = await User.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await User.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        weeklyData[index].count = result.get("count");
      }
    });

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCumulativeUserRegistrations = async (req, res) => {
  try {
    const earliest = await User.min("created_at");
    const latest = await User.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await User.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    let cumulativeCount = 0;
    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        cumulativeCount += result.get("count");
        weeklyData[index].count = result.get("count");
        weeklyData[index].cumulativeCount = cumulativeCount;
      }
    });

    for (let i = 0; i < weeklyData.length; i++) {
      if (i > 0) {
        weeklyData[i].cumulativeCount =
          weeklyData[i].count + weeklyData[i - 1].cumulativeCount;
      }
    }

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **************** UserTextRating ****************
const getRatingPlausibilityDate = async (req, res) => {
  try {
    const earliest = await UserTextRating.min("created_at");
    const latest = await UserTextRating.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await UserTextRating.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        weeklyData[index].count = result.get("count");
      }
    });

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCumulativeRatingPlausibility = async (req, res) => {
  try {
    const earliest = await UserTextRating.min("created_at");
    const latest = await UserTextRating.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await UserTextRating.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    let cumulativeCount = 0;
    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        cumulativeCount += result.get("count");
        weeklyData[index].count = result.get("count");
        weeklyData[index].cumulativeCount = cumulativeCount;
      }
    });

    for (let i = 0; i < weeklyData.length; i++) {
      if (i > 0) {
        weeklyData[i].cumulativeCount =
          weeklyData[i].count + weeklyData[i - 1].cumulativeCount;
      }
    }

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **************** User ****************
const getUserErrorDetailDate = async (req, res) => {
  try {
    const earliest = await UserErrorDetail.min("created_at");
    const latest = await UserErrorDetail.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await UserErrorDetail.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        weeklyData[index].count = result.get("count");
      }
    });
    console.log(weeklyData);

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCumulativeUserErrorDetail = async (req, res) => {
  try {
    const earliest = await UserErrorDetail.min("created_at");
    const latest = await UserErrorDetail.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await UserErrorDetail.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    let cumulativeCount = 0;
    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        cumulativeCount += result.get("count");
        weeklyData[index].count = result.get("count");
        weeklyData[index].cumulativeCount = cumulativeCount;
      }
    });

    for (let i = 0; i < weeklyData.length; i++) {
      if (i > 0) {
        weeklyData[i].cumulativeCount =
          weeklyData[i].count + weeklyData[i - 1].cumulativeCount;
      }
    }

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **************** UserTypingErrors ****************
const getUserTypingErrorsDate = async (req, res) => {
  try {
    const earliest = await UserTypingErrors.min("created_at");
    const latest = await UserTypingErrors.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await UserTypingErrors.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        weeklyData[index].count = result.get("count");
      }
    });

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCumulativeUserTypingErrors = async (req, res) => {
  try {
    const earliest = await UserTypingErrors.min("created_at");
    const latest = await UserTypingErrors.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await UserTypingErrors.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    let cumulativeCount = 0;
    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        cumulativeCount += result.get("count");
        weeklyData[index].count = result.get("count");
        weeklyData[index].cumulativeCount = cumulativeCount;
      }
    });

    for (let i = 0; i < weeklyData.length; i++) {
      if (i > 0) {
        weeklyData[i].cumulativeCount =
          weeklyData[i].count + weeklyData[i - 1].cumulativeCount;
      }
    }

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// **************** UserSentenceSpecification ****************
const getUserSentenceSpecificationDate = async (req, res) => {
  try {
    const earliest = await UserSentenceSpecification.min("created_at");
    const latest = await UserSentenceSpecification.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await UserSentenceSpecification.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        weeklyData[index].count = result.get("count");
      }
    });

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCumulativeUserSentenceSpecification = async (req, res) => {
  try {
    const earliest = await UserSentenceSpecification.min("created_at");
    const latest = await UserSentenceSpecification.max("created_at");

    if (!earliest) {
      return res.status(200).json([]);
    }

    const results = await UserSentenceSpecification.findAll({
      attributes: [
        [
          sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u"),
          "week",
        ],
        [sequelize.fn("COUNT", sequelize.col("id")), "count"],
      ],
      group: [sequelize.fn("DATE_FORMAT", sequelize.col("created_at"), "%Y%u")],
    });

    const weeklyData = generateWeeklySeries(earliest, latest);

    let cumulativeCount = 0;
    results.forEach((result) => {
      const weekNumber = result.get("week");
      const index = weeklyData.findIndex((w) => w.week === weekNumber);
      if (index !== -1) {
        cumulativeCount += result.get("count");
        weeklyData[index].count = result.get("count");
        weeklyData[index].cumulativeCount = cumulativeCount;
      }
    });

    for (let i = 0; i < weeklyData.length; i++) {
      if (i > 0) {
        weeklyData[i].cumulativeCount =
          weeklyData[i].count + weeklyData[i - 1].cumulativeCount;
      }
    }

    res.status(200).json(weeklyData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getUserRegistrationsDate,
  getCumulativeUserRegistrations,
  getCumulativeRatingPlausibility,
  getRatingPlausibilityDate,
  getUserErrorDetailDate,
  getCumulativeUserErrorDetail,
  getUserTypingErrorsDate,
  getCumulativeUserTypingErrors,
  getUserSentenceSpecificationDate,
  getCumulativeUserSentenceSpecification,
};
