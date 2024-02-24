const express = require("express");
const router = express.Router();
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Assuming you have defined a JWT_SECRET somewhere in your code
const JWT_SECRET = "thecybercroc@BI19"; // Replace with your actual secret key

// Creating a new user using: POST "/api/auth/createuser" (No need to be logged in)
router.post(
  "/createuser",
  [
    // Validation checks for user input
    body("name", "Enter a valid name with at least 3 characters").isLength({
      min: 3,
    }),
    body("email", "Enter a valid email address").isEmail(),
    body("password", "Password must be at least 5 characters long").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // Checking for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If errors exist, send a response with the errors
      return res.status(400).json({ errors: errors.array() });
    }

    // Checking if a user with the provided email already exists
    let existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      // If a user with the email already exists, send an error response
      return res
        .status(400)
        .json({ error: "A user with this email already exists." });
    }

    // Generating a salt and hashing the user's password
    try {
      const salt = await bcrypt.genSalt(10); // Generating a salt
      const hashedPassword = await bcrypt.hash(req.body.password, salt); // Hashing the password

      // Creating a new user with the hashed password
      const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
      });

      // Generating a JWT for the newly created user
      const data = {
        id: newUser.id,
      };
      const authToken = jwt.sign(data, JWT_SECRET);

      // Logging the token (Note: Avoid logging sensitive information in a production environment)
      console.log(authToken);

      // Sending a response with the newly created user information and the JWT
      res.json({ user: newUser, token: authToken });
    } catch (error) {
      // Handling any errors that might occur during user creation
      console.error(error);
      res.status(500).send("Internal Server Error");
    }
  }
);

module.exports = router;
