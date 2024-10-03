const { body } = require("express-validator");

const createReviewValidator = [
  body("comment").notEmpty().withMessage("Content must not be empty"),
  body("rating").notEmpty().withMessage("Rating must not be empty"),
];

module.exports = {
  createReviewValidator,
};
