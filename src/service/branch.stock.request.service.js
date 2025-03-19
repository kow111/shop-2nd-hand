const BranchStockRequest = require('../model/branch.stock.request.model');
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
            throw new Error("Request not found");
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
            throw new Error("Request not found");
        }

        const productIndex = request.products.findIndex(p => p.product.toString() === productId);
        if (productIndex === -1) {
            throw new Error("Product not found");
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

module.exports = {
    postStockRequestService,
    getStockRequestService,
    updateStockRequestStatusService,
    updateProductStatusService,
};