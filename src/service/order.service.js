const CancelRequest = require("../model/cancel.request.model");
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
            priceAtCreate: item.priceAtCreate,
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
      throw new Error("Không tìm thấy đơn hàng");
    }
    if (order.status === "CANCELLED") {
      throw new Error("Đơn hàng đã bị hủy");
    }
    const cancelRequest = await CancelRequest.findOne({ order: orderId });
    if (!cancelRequest) {
      if (order.status !== "PENDING") {
        throw new Error(
          "Bạn chỉ có thể hủy đơn hàng khi đơn hàng đang ở trạng thái chờ xác nhận"
        );
      }
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
          (user) => user.toString() !== userId.toString()
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
    if (status === "DELIVERED") {
      order.paymentStatus = "PAID";
    }
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
    // Lấy danh sách đơn hàng đã giao của user
    const orders = await Order.find({
      user: userId,
      status: "DELIVERED",
    }).populate("products.product");

    // Lấy danh sách review của user
    const reviews = await Review.find({ user: userId }).populate("product");

    // Tập hợp ID của các sản phẩm đã được review
    const reviewedProductIds = new Set(reviews.map((review) => review.product._id.toString()));

    const productSet = new Set(); // Dùng để tránh thêm trùng sản phẩm
    const productsWithoutReview = []; // Danh sách sản phẩm chưa review
    const productsWithReview = []; // Danh sách sản phẩm đã review với review của user

    // Lọc sản phẩm từ danh sách đơn hàng
    for (const order of orders) {
      for (const item of order.products) {
        const productId = item.product._id.toString();
        // Kiểm tra nếu sản phẩm chưa được thêm vào bất kỳ danh sách nào
        if (!productSet.has(productId)) {
          productSet.add(productId);
          if (reviewedProductIds.has(productId)) {
            // Nếu sản phẩm đã review, thêm vào danh sách đã review cùng review của user
            const userReview = reviews.find(
              (review) => review.product._id.toString() === productId
            );
            productsWithReview.push({ product: item.product, review: userReview });
          } else {
            // Nếu sản phẩm chưa review, thêm vào danh sách chưa review
            productsWithoutReview.push(item.product);
          }
        }
      }
    }

    return {
      productsWithoutReview,
      productsWithReview,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};


const getOrderByAdminService = async () => {
  try {
    let orders = await Order.find()
      .populate("products.product")
      .populate("discountCode")
      .sort({ createdAt: -1 });
    return {
      orders,
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
