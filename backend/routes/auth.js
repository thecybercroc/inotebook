const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");

// Create a User using: POST "/api/auth" Doesn't require Auth
router.post(
  "/",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password must be minimum 5 characters long").isLength({
      min: 5,
    }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    User.create({
      name: req.body.name, // Update to the correct field
      email: req.body.email,
      password: req.body.password,
    })
      .then((user) => res.json(user))
      .catch((error) => {
        console.error(error);
        res.status(500).send("Internal Server Error");
      });
  }
);

module.exports = router;
