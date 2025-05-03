const BranchStockRequest = require('../model/branch.stock.request.model');
const Order = require('../model/order.model');
const mongoose = require('mongoose');

const postStockRequestService = async (branch, products, userId) => {
    try {
        const formattedProducts = products.map(product => ({
            product: product,
            status: "pending"
        }));

        const request = await BranchStockRequest.create({
            branch,
            products: formattedProducts,
            createdBy: userId,
        });
        return request;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getStockRequestService = async (filter = {}) => {
    try {
        let query = {};
        if (filter.branch && filter.branch !== '0') {
            query.branch = new mongoose.Types.ObjectId(filter.branch);
        }

        if (filter.status) {
            query.status = filter.status;
        }

        if (filter.productStatus) {
            query.products = {
                $elemMatch: { status: filter.productStatus }
            };
        }

        // Lấy dữ liệu có phân trang
        const requests = await BranchStockRequest
            .find(query)
            .sort({ createdAt: -1 })
            .populate("createdBy")
            .populate("branch")
            .populate("products.product");


        return requests;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateStockRequestStatusService = async (requestId, status) => {
    try {
        const request = await BranchStockRequest.findById(requestId);
        if (!request) {
            throw new Error("Yêu cầu không tồn tại");
        }
        request.status = status;
        await request.save();
        return request;
    } catch (error) {
        throw new Error(error.message);
    }
};

const updateProductStatusService = async (requestId, productId, status) => {
    try {
        const request = await BranchStockRequest.findById(requestId);
        if (!request) {
            throw new Error("Yêu cầu không tồn tại");
        }

        const productIndex = request.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            throw new Error("Sản phẩm không tồn tại trong yêu cầu");
        }

        request.products[productIndex].status = status;

        if (request.products.every(p => p.status === "transferred")) {
            request.status = "approved";
        }

        await request.save();
        return request;
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteStockRequestService = async (requestId) => {
    try {
        const request = await BranchStockRequest.findOne({ _id: requestId, status: "pending" });
        if (!request) {
            throw new Error("Yêu cầu không tồn tại hoặc đã được duyệt, không thể xóa");
        }
        await BranchStockRequest.findByIdAndDelete(requestId);
    } catch (error) {
        throw new Error(error.message);
    }
};

const getPendingStockByBranchAndProductService = async (branchId, productId) => {
    try {
        const orders = await Order.find({
            branch: branchId,
            status: { $nin: ["SHIPPED", "DELIVERED", "CANCELLED"] },
            "pendingProducts.product": productId
        }).select("pendingProducts");
        let totalPending = 0;

        for (const order of orders) {
            for (const item of order.pendingProducts) {
                if (item.product.toString() === productId.toString()) {
                    totalPending += item.quantity || 0;
                }
            }
        }
        return totalPending;
    } catch (error) {
        throw new Error(error.message);
    }
}

module.exports = {
    postStockRequestService,
    getStockRequestService,
    updateStockRequestStatusService,
    updateProductStatusService,
    deleteStockRequestService,
    getPendingStockByBranchAndProductService
};