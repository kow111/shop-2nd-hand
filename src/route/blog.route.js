const express = require("express");
const {
  getBlog,
  postCreateBlog,
  getBlogBySlug,
} = require("../controller/blog.controller");
const routerAPI = express.Router();

routerAPI.get("/", getBlog);
routerAPI.get("/:slug", getBlogBySlug);
routerAPI.post("/", postCreateBlog);

module.exports = routerAPI;
