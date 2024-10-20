const {
  addDiscountSerivce,
  applyDiscountService,
  getDiscountService,
  getDiscountByCodeService,
  getDiscountUserDontHaveService,
} = require("../service/discount.service");

const postCreateDiscount = async (req, res) => {
  try {
    const { discountCode, discountPercentage, expiredAt, usageLimit } =
      req.body;
    let data = {
      discountCode,
      discountPercentage,
      expiredAt,
      usageLimit,
    };
    let rs = await addDiscountSerivce(data);
    return res.status(200).json({
      DT: rs,
      EM: "Create discount successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getApplyDiscount = async (req, res) => {
  try {
    const { discountCode } = req.body;
    const userId = req.user.userId;
    let rs = await applyDiscountService(discountCode, userId);
    return res.status(200).json({
      DT: rs,
      EM: "Apply discount successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getDiscountByCode = async (req, res) => {
  try {
    const { discountCode } = req.query;
    const userId = req.user.userId;
    let rs = await getDiscountByCodeService(discountCode, userId);
    return res.status(200).json({
      DT: rs,
      EM: "Get discount by code successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getDiscount = async (req, res) => {
  try {
    const { page } = req.query;
    let rs = await getDiscountService({ page });
    return res.status(200).json({
      DT: rs,
      EM: "Get all discount successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getDiscountUserDontHave = async (req, res) => {
  try {
    const userId = req.user.userId;
    let rs = await getDiscountUserDontHaveService(userId);
    return res.status(200).json({
      DT: rs,
      EM: "Get discount user dont have successfully",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  postCreateDiscount,
  getApplyDiscount,
  getDiscount,
  getDiscountByCode,
  getDiscountUserDontHave,
};
