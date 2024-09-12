const express = require("express");
const upload = require("../config/multer.config");
const { uploadImage } = require("../controller/upload.controller");

const routerAPI = express.Router();

routerAPI.post("/", upload.single("image"), uploadImage);

module.exports = routerAPI;
