const {
  addDiscountSerivce,
  getDiscountService,
  getDiscountByCodeService,
  getAllDiscountsService,
} = require("../service/discount.service");

const postCreateDiscount = async (req, res) => {
  try {
    const { discountCode, discountPercentage, expiredAt, usageLimit, type } =
      req.body;
    let data = {
      discountCode,
      discountPercentage,
      expiredAt,
      usageLimit,
      type,
    };
    let rs = await addDiscountSerivce(data);
    return res.status(200).json({
      DT: rs,
      EM: "Tạo mã giảm giá thành công",
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
      EM: "Lấy mã giảm giá theo code thành công",
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
    const { page, type } = req.query;
    let rs = await getDiscountService({ page, type });
    return res.status(200).json({
      DT: rs,
      EM: "Lấy tất cả mã giảm giá thành công",
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
      EM: "Lấy mã giảm giá mà user chưa có thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getAllDiscount = async (req, res) => {
  try {
    let rs = await getAllDiscountsService();
    return res.status(200).json({
      DT: rs,
      EM: "Lấy tất cả mã giảm giá thành công",
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
  getDiscount,
  getDiscountByCode,
  getDiscountUserDontHave,
  getAllDiscount,
};
