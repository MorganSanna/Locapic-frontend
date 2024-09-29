var express = require("express");
var router = express.Router();

require("../models/connection");
const Place = require("../models/places");
const { checkBody } = require("../modules/checkBody");

router.post("/places", (req, res) => {
  if (!checkBody(req.body, ["nickname", "name", "latitude", "longitude"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  const { nickname, name, latitude, longitude } = req.body;
  const newPlace = new Place ({ nickname, name, latitude, longitude})


  newPlace.save().then(() => {
    res.json({ result: true});
  });
});

router.get("/places/:nickname", (req, res) => {
  Place.find({ nickname: { $regex: new RegExp(req.params.nickname, "i")} }).then((data) => {
    if (data) {
      res.json({
        result: true,
        places: data
      });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.delete("/places", (req, res) => {
  if (!checkBody(req.body, ["nickname", "name"])) {
    res.json({ result: false, error: "Missing or empty fields" });
    return;
  }
  Place.deleteOne({
    name: { $regex: new RegExp(req.body.name, "i") },
    nickname : { $regex: new RegExp(req.body.nickname, "i") }
  }).then((deletedDoc) => {
    if (deletedDoc.deletedCount > 0) {
      // document successfully deleted
        res.json({ result: true });
    } else {
      res.json({ result: false, error: "Place not found" });
    }
  });
});

module.exports = router;
