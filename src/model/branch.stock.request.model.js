const mongoose = require("mongoose");

const branchStockRequestModel = new mongoose.Schema({
    branch: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
    },
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "transferred", "not_available"],
            default: "pending",
        }
    }],
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });

const branchStockRequest = mongoose.model("BranchStockRequest", branchStockRequestModel);

module.exports = branchStockRequest;