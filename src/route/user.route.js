const express = require("express");
const { auth, requireAdmin } = require("../middleware/auth");
const {
  putUpdateUser,
  getUserByIdUser,
  getUser,
  putUpdateUserAdmin,
  putUpdateFavorite,
} = require("../controller/user.controller");

const routerAPI = express.Router();

routerAPI.get("/info", auth, getUserByIdUser);
routerAPI.get("/", auth, requireAdmin, getUser);
routerAPI.put("/update", auth, putUpdateUser);
routerAPI.put("/update/:userId", auth, requireAdmin, putUpdateUserAdmin);
routerAPI.put("/favorite", auth, putUpdateFavorite);

module.exports = routerAPI;
