const {
  getBlogService,
  createBlogService,
  getBlogBySlugService,
  updateBlogService,
} = require("../service/blog.service");
const getBlog = async (req, res) => {
  try {
    const blogs = await getBlogService();
    return res.status(200).json({
      DT: blogs,
      EM: "Lấy danh sách blog thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const postCreateBlog = async (req, res) => {
  try {
    const data = req.body;
    const blog = await createBlogService(data);
    return res.status(200).json({
      DT: blog,
      EM: "Tạo blog thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const blog = await getBlogBySlugService(slug);
    return res.status(200).json({
      DT: blog,
      EM: "Lấy blog thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

const putUpdateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const blog = await updateBlogService(id, data);
    return res.status(200).json({
      DT: blog,
      EM: "Cập nhật blog thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  getBlog,
  postCreateBlog,
  getBlogBySlug,
  putUpdateBlog,
};
