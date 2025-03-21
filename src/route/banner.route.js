const express = require("express");
const {
  getBanner,
  postCreateBanner,
  putUpdateBanner,
  deleteBanner,
  getBannerBySlug,
} = require("../controller/banner.controller");

const routerAPI = express.Router();

routerAPI.get("/", getBanner);
routerAPI.get("/promotions/:slug", getBannerBySlug);
routerAPI.post("/", postCreateBanner);
routerAPI.put("/:id", putUpdateBanner);
routerAPI.delete("/:id", deleteBanner);

module.exports = routerAPI;
