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
        console.log(filter);
        if (filter.branch) {
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

module.exports = {
    postStockRequestService,
    getStockRequestService
};