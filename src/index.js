const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const http = require("http");
const connection = require("./config/database");

const { initSocket } = require("./config/socket");

const authRoute = require("./route/auth.route");
const productRoute = require("./route/product.route");
const uploadRoute = require("./route/upload.route");
const categoryRoute = require("./route/category.route");
const userRoute = require("./route/user.route");
const cartRoute = require("./route/cart.route");
const orderRoute = require("./route/order.route");
const notificationRoute = require("./route/notification.route");
const reviewRoute = require("./route/review.route");
const discountRoute = require("./route/discount.route");
const paymentRoute = require("./route/payment.route");
const addressRoute = require("./route/address.route");
const colorRoute = require("./route/color.route");
const dashboardRoute = require("./route/dashboard.route");
const cancelRequestRoute = require("./route/cancel.request.route");
const bannerRoute = require("./route/banner.route");
const branchRoute = require("./route/branch.route");
const branchStockRoute = require("./route/branch.stock.route");

dotenv.config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/product", productRoute);
app.use("/api/v1/upload", uploadRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/cart", cartRoute);
app.use("/api/v1/order", orderRoute);
app.use("/api/v1/notification", notificationRoute);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/discount", discountRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/address", addressRoute);
app.use("/api/v1/color", colorRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/cancel-request", cancelRequestRoute);
app.use("/api/v1/banner", bannerRoute);
app.use("/api/v1/branch", branchRoute);
app.use("/api/v1/branch-stock", branchStockRoute);

// Khởi tạo Socket.io
initSocket(server);

const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await connection();
    server.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
})();
