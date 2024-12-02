const express = require("express");
const {
  postCancelRequest,
  getCancelRequestUser,
  getCancelRequestAdmin,
  putApproveCancelRequest,
  putRejectCancelRequest,
  deleteCancelRequest,
} = require("../controller/cancel.request.controller");
const { auth, requireAdmin } = require("../middleware/auth");
const routerAPI = express.Router();

routerAPI.post("/", auth, postCancelRequest);
routerAPI.get("/", auth, getCancelRequestUser);
routerAPI.get("/admin", auth, requireAdmin, getCancelRequestAdmin);
routerAPI.put(
  "/approve/:requestId",
  auth,
  requireAdmin,
  putApproveCancelRequest
);
routerAPI.put("/reject/:requestId", auth, requireAdmin, putRejectCancelRequest);
routerAPI.delete("/:requestId", auth, deleteCancelRequest);

module.exports = routerAPI;
