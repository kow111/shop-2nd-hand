const Discount = require("../model/discount.model");
const Order = require("../model/order.model");
const Product = require("../model/product.model");
const Review = require("../model/review.model");
const { addNotificationJob } = require("../queues/notification.queue");
const { applyDiscountService } = require("./discount.service");
const mongoose = require("mongoose");

const createOrderService = async (data) => {
  const session = await mongoose.startSession(); // Khởi tạo session
  session.startTransaction();

  try {
    let {
      userId,
      products,
      totalAmount,
      paymentMethod,
      name,
      phone,
      address,
      discountCode,
    } = data;

    // Kiểm tra và cập nhật số lượng sản phẩm
    for (const item of products) {
      const product = await Product.findById(item.productId).session(session);

      if (!product || product.quantity < item.quantity) {
        throw new Error(
          `Sản phẩm ${product.productName} không đủ số lượng để đặt hàng, số lượng sản phẩm hiện có: ${product.quantity}`
        );
      }

      product.quantity -= item.quantity;
      await product.save({ session });
    }

    // Áp dụng mã giảm giá nếu có
    if (discountCode) {
      await applyDiscountService(discountCode, userId);
    } else {
      discountCode = null;
    }

    // Tạo đơn hàng trong session
    const order = await Order.create(
      [
        {
          user: userId,
          products: products.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
          })),
          totalAmount,
          paymentMethod,
          discountCode,
          name,
          phone,
          address,
        },
      ],
      { session }
    );

    await session.commitTransaction();
    return order[0];
  } catch (error) {
    await session.abortTransaction();
    throw new Error(error.message);
  } finally {
    session.endSession();
  }
};

const cancelOrderService = async (orderId, userId) => {
  try {
    let order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      throw new Error("Order not found");
    }
    if (order.status === "CANCELLED") {
      throw new Error("Đơn hàng đã bị hủy");
    }
    if (order.status !== "PENDING") {
      throw new Error(
        "Bạn chỉ có thể hủy đơn hàng khi đơn hàng đang ở trạng thái chờ xác nhận"
      );
    }
    for (const item of order.products) {
      const product = await Product.findById(item.product);

      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }
    order.status = "CANCELLED";
    if (
      order.discountCode &&
      order.discountCode !== null &&
      order.discountCode !== ""
    ) {
      const discount = await Discount.findById(order.discountCode);
      if (discount) {
        discount.usersUsed = discount.usersUsed.filter(
          (user) => user.toString() !== userId
        );
        await discount.save();
      }
    }
    await order.save();
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const changeOrderStatusService = async (orderId, status) => {
  try {
    let order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    order.status = status;
    await order.save();
    addNotificationJob({
      userId: order.user,
      orderId: order._id,
      newStatus: status,
    });
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const changeOrderPaymentStatusService = async (orderId, status) => {
  try {
    let order = await Order.findById(orderId);
    if (!order) {
      throw new Error("Không tìm thấy đơn hàng");
    }
    order.paymentStatus = status;
    await order.save();
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderByUserService = async (userId) => {
  try {
    let orders = await Order.find({ user: userId })
      .populate("products.product")
      .populate("discountCode");
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderByIdService = async (orderId) => {
  try {
    let order = await Order.findById(orderId)
      .populate("products.product")
      .populate("discountCode");
    return order;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductUserPurchasedService = async (userId) => {
  try {
    let orders = await Order.find({
      user: userId,
      status: "DELIVERED",
    }).populate("products.product");

    const reviewedProductIds = new Set(
      (await Review.find({ user: userId })).map((review) => review.product.toString())
    );

    const productSet = new Set();
    const products = [];

    for (const order of orders) {
      for (const item of order.products) {
        const productId = item.product._id.toString();
        // Chỉ thêm sản phẩm nếu nó chưa có trong danh sách review
        if (!reviewedProductIds.has(productId) && !productSet.has(productId)) {
          productSet.add(productId);
          products.push(item.product);
        }
      }
    }
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderByAdminService = async (filter = {}) => {
  try {
    const limit = 10;
    let skip = 0;

    if (filter.page) {
      skip = (filter.page - 1) * limit;
    }

    const query = {};

    if (filter.status) {
      query.status = filter.status;
    }

    const totalItems = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    let orders = await Order.find(query)
      .populate("products.product")
      .populate("discountCode")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    return {
      orders,
      totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const isOrderCanceled = async (orderId) => {
  const order = await Order.findById(orderId);
  return order.status === "CANCELLED";
};

module.exports = {
  createOrderService,
  cancelOrderService,
  changeOrderStatusService,
  getOrderByUserService,
  getOrderByIdService,
  getProductUserPurchasedService,
  getOrderByAdminService,
  changeOrderPaymentStatusService,
  isOrderCanceled,
};
