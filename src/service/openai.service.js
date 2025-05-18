const axios = require("axios");

const generateProductDescription = async (productName, features) => {
  const prompt = `Viết một đoạn mô tả sản phẩm bằng tiếng Việt, sử dụng văn phong sang trọng, lôi cuốn và chuyên nghiệp. Sản phẩm là "${productName}", với các đặc điểm nổi bật: ${features.join(
    ", "
  )}. 
Trình bày nội dung bằng các thẻ HTML (ví dụ: <h2>, <p>, <ul>, <li>), KHÔNG sử dụng ký hiệu markdown hay \`\`\`.`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-chat:free",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw new Error("Gọi OpenRouter thất bại.");
  }
};
module.exports = {
  generateProductDescription,
};
