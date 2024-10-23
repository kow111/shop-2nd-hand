const { uploadToFirebase } = require("../service/firebase.service");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("Không có file nào được tải lên");
    }

    const fileBuffer = req.file.buffer;
    const fileName = Date.now() + "-" + req.file.originalname;
    const mimeType = req.file.mimetype;

    // Gọi service để tải file lên Firebase
    const publicUrl = await uploadToFirebase(
      fileBuffer,
      fileName,
      mimeType,
      "imageProduct"
    );

    return res.status(200).send({
      DT: publicUrl,
      EM: "Tải file lên thành công",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Lỗi khi tải file lên",
      error: error.message,
    });
  }
};
