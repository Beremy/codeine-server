var express = require("express");
var router = express.Router();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

router.get("/:userid", function (req, res, next) {
  var userId = req.params.userid;
  res.send("respond with a resource " + userId);
});

router.post("/", function (req, res) {
  res.send("Got a POST request");
});

router.put("/:id", function (req, res) {
  res.send("Got a PUT request at /user");
});

router.delete("/", function (req, res) {
  res.send("Got a DELETE request at /user");
});

module.exports = router;
