const express = require("express");
const {
  getBranchs,
  createBranch,
  updateBranch,
} = require("../controller/branch.controller");
const routerAPI = express.Router();

routerAPI.get("/", getBranchs);
routerAPI.post("/", createBranch);
routerAPI.put("/:id", updateBranch);

module.exports = routerAPI;
