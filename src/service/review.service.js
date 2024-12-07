const Review = require("../model/review.model");

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

const getAllReviewService = async (filter = {}) => {
  try {
    const limit = 10;
    let skip = 0;
    if (filter.page) {
      skip = (filter.page - 1) * limit;
    }
    const totalItems = await Review.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    let rs = await Review.find()
      .populate("user", "username email image")
      .populate("product")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });
    return {
      rs,
      totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createReviewService,
  getReviewByProductService,
  updateReviewService,
  getAllReviewService,
};
