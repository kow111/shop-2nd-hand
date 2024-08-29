const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connection = require("./config/database");
const userRoute = require("./router/user.route");
dotenv.config();

// Khởi tạo ứng dụng Express
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Định nghĩa route cơ bản
app.use("/api/v1/user", userRoute);

// Định nghĩa cổng và chạy server
const PORT = process.env.PORT || 3000;
(async () => {
  try {
    await connection();
    app.listen(PORT, () => {
      console.log(`Example app listening on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
})();
