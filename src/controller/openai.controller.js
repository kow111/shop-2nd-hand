const { generateProductDescription } = require("../service/openai.service");

const getDescription = async (req, res) => {
  try {
    const { productName, features } = req.body;

    const description = await generateProductDescription(productName, features);
    return res.status(200).json({
      DT: description,
      EM: "Sinh description thành công",
    });
  } catch (error) {
    return res.status(400).json({
      DT: null,
      EM: error.message,
    });
  }
};

module.exports = {
  getDescription,
};
