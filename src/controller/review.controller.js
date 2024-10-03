import { validationResult } from "express-validator";
import { createReviewService } from "../service/review.service";

const postCreateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((error) => error.msg);
    return res.status(400).json({ DT: null, EM: errorMessages[0] });
  }
  try {
    const review = req.body;
    review.user = req.user._id;
    const rs = await createReviewService(review);
    res.status(200).json(rs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { postCreateReview };
