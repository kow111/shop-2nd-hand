const express = require("express");
const {
  getBlog,
  postCreateBlog,
  getBlogBySlug,
  putUpdateBlog,
} = require("../controller/blog.controller");
const routerAPI = express.Router();

routerAPI.get("/", getBlog);
routerAPI.get("/:slug", getBlogBySlug);
routerAPI.post("/", postCreateBlog);
routerAPI.put("/:id", putUpdateBlog);

module.exports = routerAPI;
