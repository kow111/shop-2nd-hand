const express = require("express");
const { postCreateReview } = require("../controller/review.controller");
const { auth } = require("../middleware/auth");
const { createReviewValidator } = require("../validator/review.validator");

const routerAPI = express.Router();

routerAPI.post("/", auth, createReviewValidator, postCreateReview);

module.exports = routerAPI;
