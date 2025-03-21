const Banner = require("../model/banner.model");

const createBannerService = async (data) => {
  const { title, image, url, position, status, slug, products } = data;
  try {
    const banner = await Banner.create({
      title,
      image,
      url,
      position,
      status,
      slug,
      products,
    });
    return banner;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getBannerService = async () => {
  try {
    const banners = await Banner.find()
      .sort({ position: 1 })
      .populate("products");
    return banners;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateBannerService = async (id, data) => {
  const { title, image, url, position, status, slug } = data;
  let { products } = data;
  if (products === "" || products === "[]") {
    products = [];
  }
  try {
    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        title,
        image,
        url,
        position,
        status,
        slug,
        products,
      },
      { new: true }
    );
    return banner;
  } catch (err) {
    throw new Error(err.message);
  }
};

const deleteBannerService = async (id) => {
  try {
    const banner = await Banner.findByIdAndDelete(id);
    return banner;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getBannerBySlugService = async (slug) => {
  try {
    const banner = await Banner.findOne({
      slug,
    }).populate("products");
    return banner;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createBannerService,
  getBannerService,
  updateBannerService,
  deleteBannerService,
  getBannerBySlugService,
};
