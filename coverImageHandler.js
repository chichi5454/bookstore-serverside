/** @format */

const multer = require("multer");
const path = require("path");

const storageForCoverImages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/public/cover");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const uploadCoverImage = multer({
  storage: storageForCoverImages,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
    }
  },
}).single("coverImage");

const handleCoverImageUpload = (req, res) => {
  uploadCoverImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message });
    }
    // Cover image uploaded successfully
    const fileName = req.file.filename;
    res.send(`/public/cover/${fileName}`);
  });
};

module.exports = {
  handleCoverImageUpload,
};
