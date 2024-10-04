const Order = require("../model/order.model");
const Product = require("../model/product.model");
const { addNotificationJob } = require("../queues/notification.queue");
const { applyDiscountService } = require("./discount.service");
const mongoose = require("mongoose");

const createOrderService = async (data) => {
  const session = await mongoose.startSession(); // Khởi tạo session
  session.startTransaction();

  try {
    const {
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
      throw new Error("Order already cancelled");
    }
    if (order.status !== "PENDING") {
      throw new Error("You can only cancel orders that are pending");
    }
    for (const item of order.products) {
      const product = await Product.findById(item.product);

      if (product) {
        product.quantity += item.quantity;
        await product.save();
      }
    }
    order.status = "CANCELLED";
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
      throw new Error("Order not found");
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

const getOrderByUserService = async (userId) => {
  try {
    let orders = await Order.find({ user: userId }).populate(
      "products.product"
    );
    return orders;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getOrderByIdService = async (orderId) => {
  try {
    let order = await Order.findById(orderId).populate("products.product");
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

    const productSet = new Set();
    const products = [];

    orders.forEach((order) => {
      order.products.forEach((item) => {
        if (!productSet.has(item.product._id.toString())) {
          productSet.add(item.product._id.toString());
          products.push(item.product);
        }
      });
    });
    return products;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createOrderService,
  cancelOrderService,
  changeOrderStatusService,
  getOrderByUserService,
  getOrderByIdService,
  getProductUserPurchasedService,
};
