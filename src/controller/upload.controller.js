const { uploadToFirebase } = require("../service/firebase.service");

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
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
      EM: "File uploaded successfully",
    });
  } catch (error) {
    return res.status(500).send({
      message: "Error uploading file",
      error: error.message,
    });
  }
};
