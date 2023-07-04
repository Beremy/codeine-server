var express = require("express");
var path = require("path");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const PORT = 3001;
const { sequelize, connectToDb } = require("./service/db");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var achievementsRouter = require("./routes/achievements");
var adminsRouter = require("./routes/admins");
var textsRouter = require("./routes/texts");
var themeRouter = require("./routes/themes");
var sentencesRouter = require("./routes/sentences");
var userSentenceSpecificationRouter = require("./routes/userSentenceSpecifications");
var utilsRouter = require("./routes/utils");

var app = express();
app.use(cors());

// // Si on veut restreindre l'accès:
// const corsOptions = {
//   origin: "http://localhost:3000", // Remplacez par l'URL de l'application client
// };
// app.use(cors(corsOptions));

app.listen(PORT, '0.0.0.0', async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await connectToDb();
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/achievements", achievementsRouter);
app.use("/admins", adminsRouter);
app.use("/texts", textsRouter);
app.use("/themes", themeRouter);
app.use("/sentences", sentencesRouter);
app.use("/userSentenceSpecifications", userSentenceSpecificationRouter);
app.use("/utils", utilsRouter);

module.exports = app;
