const multer = require("multer");
const mongoose = require("mongoose");
const File = mongoose.model("File", {
  originalname: String,
  filename: String,
  path: String,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + ".jpg");
  },
});
const upload = multer({ storage: storage }).array("images", 5);

const uploads = (req, res, next) => {
  upload(req, res, async function (err) {
    if (err instanceof multer.MulterError) {
      return res
        .status(400)
        .json({ error: "Multer error", details: err.message });
    } else if (err) {
      return res
        .status(500)
        .json({ error: "Internal server error", details: err.message });
    }
    const files = req.files;
    const fileDocuments = files.map((file) => ({
      originalname: file.originalname,
      filename: file.filename,
      path: file.path,
    }));

    try {
      await File.create(fileDocuments);
      res.status(201).json({ message: "Files uploaded successfully!" });
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Failed to save file information to MongoDB" });
      console.log(err);
    }
  });
};
module.exports = uploads;
