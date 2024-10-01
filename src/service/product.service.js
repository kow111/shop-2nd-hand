const Product = require("../model/product.model");
const mongoose = require("mongoose");

const createProductService = async (data) => {
  try {
    const {
      productName,
      description,
      size,
      category,
      quantity,
      images,
      price,
    } = data;
    let rs = await Product.create({
      productName,
      description,
      size,
      category,
      quantity,
      images,
      price,
    });
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductService = async (filter = {}) => {
  try {
    const limit = 10;
    let skip = 0;
    const query = {};
    if (filter.search) {
      const searchQuery = filter.search.trim().toLowerCase();
      query.$or = [
        { productName: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
      ];
    }
    if (filter.page) {
      skip = (filter.page - 1) * limit;
    }
    if (filter.category) {
      query.category = {
        $in: filter.category.split(",")
      };
      // console.log(query);
    }
    let sort = {};
    if (filter.sortOrder === "1") {
      sort.price = 1;
    } else if (filter.sortOrder === "2") {
      sort.price = -1;
    }

    sort._id = 1;

    const totalItems = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    const products = await Product.find(query)
      .limit(limit)
      .skip(skip)
      .sort(sort)
      .populate("category", "name")
    return {
      products,
      totalPages,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getProductByIdService = async (id) => {
  try {
    let rs = await Product.findById(id);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateProductService = async (id, data) => {
  try {
    let rs = await Product.findByIdAndUpdate(id, data);
    return rs;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createProductService,
  getProductService,
  getProductByIdService,
  updateProductService,
};
