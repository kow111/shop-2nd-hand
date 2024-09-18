const express = require("express");
const { auth } = require("../middleware/auth");
const {
    putUpdateUser
} = require("../controller/user.controller");

const routerAPI = express.Router();

routerAPI.put("/update", auth, putUpdateUser);

module.exports = routerAPI;