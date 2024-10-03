import Review from "../model/review.model";

const createReviewService = async (review) => {
  try {
    let rs = await Review.create(review);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

export { createReviewService };
