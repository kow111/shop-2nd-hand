const {
  getBannerService,
  createBannerService,
  updateBannerService,
  deleteBannerService,
  getBannerBySlugService,
} = require("../service/banner.service");

const getBanner = async (req, res) => {
  try {
    const banners = await getBannerService();
    return res.status(200).json({
      DT: banners,
      EM: "Lấy banner thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const postCreateBanner = async (req, res) => {
  try {
    const data = req.body;
    const banner = await createBannerService(data);
    return res.status(200).json({
      DT: banner,
      EM: "Tạo banner thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putUpdateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const banner = await updateBannerService(id, data);
    return res.status(200).json({
      DT: banner,
      EM: "Cập nhật banner thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await deleteBannerService(id);
    return res.status(200).json({
      DT: banner,
      EM: "Xóa banner thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getBannerBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const banner = await getBannerBySlugService(slug);
    return res.status(200).json({
      DT: banner,
      EM: "Lấy banner thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  getBanner,
  postCreateBanner,
  putUpdateBanner,
  deleteBanner,
  getBannerBySlug,
};
