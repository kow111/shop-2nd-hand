const { body } = require("express-validator");

const createUserValidator = [
  body("email").isEmail().withMessage("Email is not valid"),
  body("email").notEmpty().withMessage("Email must not be empty"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  body("password").notEmpty().withMessage("Title must not be empty"),
];

module.exports = {
  createUserValidator,
};
