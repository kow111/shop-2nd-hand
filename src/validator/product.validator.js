const { body } = require("express-validator");

const createProductValidator = [
  body("productName").notEmpty().withMessage("Name must not be empty"),
  body("price").notEmpty().withMessage("Price must not be empty"),
  body("quantity").notEmpty().withMessage("Stock must not be empty"),
  body("description").notEmpty().withMessage("Description must not be empty"),
  body("category").notEmpty().withMessage("Category must not be empty"),
];

module.exports = {
  createProductValidator,
};
