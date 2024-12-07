const express = require("express");
const {
  postCreateReview,
  getReviewByProduct,
  putUpdateReview,
  getAllReview,
} = require("../controller/review.controller");
const { auth } = require("../middleware/auth");
const { createReviewValidator } = require("../validator/review.validator");

const routerAPI = express.Router();

routerAPI.get("/product/:productId", getReviewByProduct);
routerAPI.get("/", getAllReview);
routerAPI.post("/", auth, createReviewValidator, postCreateReview);
routerAPI.put("/", auth, putUpdateReview);

module.exports = routerAPI;
