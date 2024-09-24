const Order = require("../model/order.model");
const Product = require("../model/product.model");

const createOrderService = async (data) => {
  try {
    const { userId, products, totalAmount, paymentMethod, address } = data;
    for (const item of products) {
      const product = await Product.findById(item.productId);

      if (!product || product.quantity < item.quantity) {
        throw new Error(
          `Sản phẩm ${product.productName} không đủ số lượng để đặt hàng, số lượng sản phẩm hiện có: ${product.quantity}`
        );
      }

      product.quantity -= item.quantity;

      await product.save();
    }
    let rs = await Order.create({
      user: userId,
      products: products.map((item) => ({
        product: item.productId,
        quantity: item.quantity,
      })),
      totalAmount,
      paymentMethod,
      address,
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
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

module.exports = {
  createOrderService,
  cancelOrderService,
};
