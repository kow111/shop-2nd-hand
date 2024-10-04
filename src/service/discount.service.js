const Discount = require("../model/discount.model");

const addDiscountSerivce = async (discount) => {
  try {
    const rs = await Discount.create(discount);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const applyDiscountService = async (discountCode, userId) => {
  try {
    const discount = await Discount.findOne({
      discountCode: discountCode,
    });
    if (!discount) {
      throw new Error("Discount code is not valid");
    }
    if (discount.usersUsed.includes(userId)) {
      throw new Error("Discount code has been used");
    }
    if (discount.expiredAt < new Date()) {
      throw new Error("Discount code is expired");
    }
    if (
      discount.usageLimit &&
      discount.usersUsed.length >= discount.usageLimit
    ) {
      throw new Error("Discount code is out of usage");
    }
    discount.usersUsed.push(userId);
    await discount.save();
    return discount.discountPercentage;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDiscountByCodeService = async (discountCode, userId) => {
  try {
    const discount = await Discount.findOne({
      discountCode: discountCode,
    });
    if (!discount) {
      throw new Error("Discount code is not valid");
    }
    if (discount.usersUsed.includes(userId)) {
      throw new Error("Discount code has been used");
    }
    if (discount.expiredAt < new Date()) {
      throw new Error("Discount code is expired");
    }
    if (
      discount.usageLimit &&
      discount.usersUsed.length >= discount.usageLimit
    ) {
      throw new Error("Discount code is out of usage");
    }
    return discount.discountPercentage;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDiscountService = async (filter = {}) => {
  try {
    const limit = 10;
    let skip = 0;
    if (filter.page) {
      skip = (filter.page - 1) * limit;
    }
    let rs = await Discount.find().skip(skip).limit(limit);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addDiscountSerivce,
  applyDiscountService,
  getDiscountService,
  getDiscountByCodeService,
};
