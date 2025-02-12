const express = require("express");
const {
  getStockByBranch,
  getStockByProduct,
  getStockByBranchAndProduct,
  updateStock,
} = require("../controller/branch.stock.controller");

const routerAPI = express.Router();

routerAPI.get("/branch/:branchId", getStockByBranch);
routerAPI.get("/product/:productId", getStockByProduct);
routerAPI.get(
  "/branch/:branchId/product/:productId",
  getStockByBranchAndProduct
);
routerAPI.put("/branch/:branchId/product/:productId", updateStock);

module.exports = routerAPI;
