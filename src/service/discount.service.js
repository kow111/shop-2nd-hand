const Discount = require("../model/discount.model");
const User = require("../model/user.model");

const addDiscountSerivce = async (discount) => {
  try {
    const discountCode = await Discount.findOne({
      discountCode: discount.discountCode,
    });
    if (discountCode) {
      throw new Error("Mã giảm giá đã tồn tại");
    }
    const rs = await Discount.create(discount);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const applyDiscountService = async (discountCode, userId) => {
  try {
    const discount = await Discount.findById(discountCode);
    if (!discount) {
      throw new Error("Mã giảm giá không hợp lệ");
    }
    if (discount.usersUsed.includes(userId)) {
      throw new Error("Mã giảm giá đã được sử dụng");
    }
    if (discount.expiredAt && discount.expiredAt < new Date()) {
      throw new Error("Mã giảm giá đã hết hạn");
    }
    if (
      discount.usageLimit &&
      discount.usersUsed.length >= discount.usageLimit
    ) {
      throw new Error("Mã giảm giá đã hết lượt sử dụng");
    }
    discount.usersUsed.push(userId);
    await discount.save();
    return discount;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDiscountByCodeService = async (discountCode, userId) => {
  try {
    const discount = await Discount.findOne({
      _id: discountCode,
    });
    if (!discount) {
      throw new Error("Mã giảm giá không hợp lệ");
    }
    if (discount.usersUsed.includes(userId)) {
      throw new Error("Mã giảm giá đã được sử dụng");
    }
    if (discount.expiredAt && discount.expiredAt < new Date()) {
      throw new Error("Mã giảm giá đã hết hạn");
    }
    if (
      discount.usageLimit &&
      discount.usersUsed.length >= discount.usageLimit
    ) {
      throw new Error("Mã giảm giá đã hết lượt sử dụng");
    }
    return discount;
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
    const query = {};
    if (filter.type) {
      if (filter.type === "PRODUCT") {
        query.$or = [{ type: "PRODUCT" }, { type: null }];
      } else {
        query.type = filter.type;
      }
    }
    const totalItems = await Discount.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    let rs = await Discount.find(query).skip(skip).limit(limit);
    return {
      discounts: rs,
      totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getDiscountUserDontHaveService = async (userId) => {
  try {
    const userUsedDiscounts = await Discount.find({ usersUsed: userId });
    const user = await User.findById(userId).select("discounts");
    let availableDiscounts = await Discount.find({
      _id: {
        $nin: [...userUsedDiscounts.map((d) => d._id), ...user.discounts],
      },
      $or: [{ expiredAt: { $gt: new Date() } }, { expiredAt: null }],
    });

    availableDiscounts = availableDiscounts.filter((discount) => {
      return (
        discount.usageLimit === null ||
        discount.usageLimit > discount.usersUsed.length
      );
    });

    return availableDiscounts.length > 0 ? availableDiscounts[0] : null;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllDiscountsService = async (filter = {}) => {
  try {
    const query = { $and: [] };

    if (filter.type) {
      if (filter.type === "PRODUCT") {
        query.$and.push({ $or: [{ type: "PRODUCT" }, { type: null }] });
      } else {
        query.$and.push({ type: filter.type });
      }
    }
    query.$and.push({
      $or: [{ expiredAt: { $gt: new Date() } }, { expiredAt: null }],
    });

    const finalQuery = query.$and.length > 0 ? query : {};

    const discounts = await Discount.find(finalQuery);
    return discounts;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  addDiscountSerivce,
  applyDiscountService,
  getDiscountService,
  getDiscountByCodeService,
  getDiscountUserDontHaveService,
  getAllDiscountsService,
};
