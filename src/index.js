const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const connection = require("./config/database");
const authRoute = require("./router/auth.route");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoute);

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
