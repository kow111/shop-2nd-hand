const express = require("express");
const { auth, requireAdmin } = require("../middleware/auth");

const {
    postStockRequest,
    getStockRequest,
    updateStockRequestStatus,
    updateProductStatus,
    deleteStockRequest,
    getPendingStockByBranchAndProduct,
} = require("../controller/branch.stock.request.controller");

const routerAPI = express.Router();

routerAPI.post("/", auth, requireAdmin, postStockRequest);
routerAPI.get("/", auth, requireAdmin, getStockRequest);
routerAPI.put("/status", auth, requireAdmin, updateStockRequestStatus);
routerAPI.put("/product/status", auth, requireAdmin, updateProductStatus);
routerAPI.delete("/:id", auth, requireAdmin, deleteStockRequest);
routerAPI.get("/pending-stock", auth, requireAdmin, getPendingStockByBranchAndProduct);

module.exports = routerAPI;