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
        $in: filter.category.split(","),
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
      .populate("category", "name");
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

const updateProductService = async (id, data, imageActions) => {
  try {
    let product = await Product.findById(id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (data) {
      if (data.productName) product.productName = data.productName;
      if (data.description) product.description = data.description;
      if (data.size) product.size = data.size;
      if (data.category) product.category = data.category;
      if (data.quantity) product.quantity = data.quantity;
      if (data.price) product.price = data.price;
    }
    if (imageActions && imageActions.length > 0) {
      imageActions.forEach((actionObj) => {
        const { action, url, oldUrl, newUrl } = actionObj;
        switch (action) {
          case "add":
            product.images.push(url);
            break;
          case "delete":
            product.images = product.images.filter((image) => image !== url);
            break;
          case "replace":
            const index = product.images.indexOf(oldUrl);
            if (index !== -1) {
              product.images[index] = newUrl;
            }
            break;
          default:
            throw new Error("Invalid action");
        }
      });
    }

    let updatedProduct = await product.save();

    return updatedProduct;
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
