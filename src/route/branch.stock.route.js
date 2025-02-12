const express = require("express");
const {
  getStockByBranch,
  getStockByProduct,
  getStockByBranchAndProduct,
  updateStock,
} = require("../controller/branch.stock.controller");

const routerAPI = express.Router();

routerAPI.get("/:branchId", getStockByBranch);
routerAPI.get("/:productId", getStockByProduct);
routerAPI.get("/:branchId/:productId", getStockByBranchAndProduct);
routerAPI.put("/:branchId/:productId", updateStock);

module.exports = routerAPI;
