const Review = require("../model/review.model");
const { getDiscountUserDontHaveService } = require("./discount.service");
const { addDiscountService } = require("./user.service");

const getReviewByProductService = async (productId) => {
  try {
    let rs = await Review.find({ product: productId }).populate("user");
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const createReviewService = async (review) => {
  try {
    let rs = await Review.create(review);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateReviewService = async (review) => {
  try {
    const reviewId = review._id;
    let rs = await Review.findByIdAndUpdate(reviewId, review);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createReviewService, getReviewByProductService, updateReviewService };
