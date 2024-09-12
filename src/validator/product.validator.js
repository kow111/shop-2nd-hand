const { body } = require("express-validator");

const createProductValidator = [
  body("name").notEmpty().withMessage("Name must not be empty"),
  body("price").notEmpty().withMessage("Price must not be empty"),
  body("stock").notEmpty().withMessage("Stock must not be empty"),
  body("description").notEmpty().withMessage("Description must not be empty"),
  body("category").notEmpty().withMessage("Category must not be empty"),
];

module.exports = {
  createProductValidator,
};
