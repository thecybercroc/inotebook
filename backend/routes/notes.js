const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  obj = {
    person: "prem",
    number: 6336383846,
  };
  res.json(obj);
});

module.exports = router;
