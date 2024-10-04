const { validationResult } = require("express-validator");
const {
  createReviewService,
  getReviewByProductService,
} = require("../service/review.service");

const getReviewByProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const rs = await getReviewByProductService(productId);
    res.status(200).json({
      DT: rs,
      EM: "Get review by product successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const postCreateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ DT: null, EM: errorMessages[0] });
  }
  try {
    const review = req.body;
    review.user = req.user.userId;
    const rs = await createReviewService(review);
    res.status(200).json({
      DT: rs,
      EM: "Create review successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { postCreateReview, getReviewByProduct };
