const Blog = require("../model/blog.model");
const { createSlug } = require("../utils/slug.helper");

const createBlogService = async (data) => {
  const { title, content, image, status } = data;
  try {
    const slug = createSlug(title);
    const blog = await Blog.create({
      title,
      content,
      image,
      status,
      slug,
    });
    return blog;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getBlogService = async () => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    return blogs;
  } catch (err) {
    throw new Error(err.message);
  }
};

const getBlogBySlugService = async (slug) => {
  try {
    const blog = await Blog.findOne({ slug });
    return blog;
  } catch (err) {
    throw new Error(err.message);
  }
};

const updateBlogService = async (id, data) => {
  const { title, content, image, status } = data;
  try {
    const slug = createSlug(title);
    const found = await Blog.find({
      _id: { $ne: id },
      slug: slug,
    });
    if (found.length > 0) {
      throw new Error("Đã tồn tại blog với slug này");
    }
    const blog = await Blog.findByIdAndUpdate(
      id,
      {
        title,
        content,
        image,
        status,
        slug,
      },
      { new: true, runValidators: true }
    );
    return blog;
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = {
  createBlogService,
  getBlogService,
  getBlogBySlugService,
  updateBlogService,
};
