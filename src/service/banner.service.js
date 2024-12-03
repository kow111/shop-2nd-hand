const Banner = require("../model/banner.model");

const createBannerService = async (data) => {
  const { title, image, url, position, status } = data;
  try {
    const banner = await Banner.create({
      title,
      image,
      url,
      position,
      status,
    });
    return banner;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getBannerService = async () => {
  try {
    const banners = await Banner.find().sort({ position: 1 });
    return banners;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateBannerService = async (id, data) => {
  const { title, image, url, position, status } = data;
  try {
    const banner = await Banner.findByIdAndUpdate(
      id,
      {
        title,
        image,
        url,
        position,
        status,
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

module.exports = {
  createBannerService,
  getBannerService,
  updateBannerService,
  deleteBannerService,
};
