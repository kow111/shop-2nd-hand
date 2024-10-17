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
    const discount = await getDiscountUserDontHaveService(review.user);
    if (discount) {
      await addDiscountService(review.user, discount._id);
    }
    return {
      review: rs,
      discount,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createReviewService, getReviewByProductService };
