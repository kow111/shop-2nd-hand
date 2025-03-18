const express = require("express");
const { auth, requireAdmin } = require("../middleware/auth");

const {
    postStockRequest,
    getStockRequest
} = require("../controller/branch.stock.request.controller");

const routerAPI = express.Router();

routerAPI.post("/", auth, requireAdmin, postStockRequest);
routerAPI.get("/", auth, requireAdmin, getStockRequest);

module.exports = routerAPI;