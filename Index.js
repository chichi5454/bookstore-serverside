/** @format */

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { handleCoverImageUpload } = require("./coverImageHandler");

const app = express();
app.use(cors());
app.use(express.json());

// Assuming you have a books array to store book details
const books = [];

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/images");
  },
  filename: function (req, file, cb) {
    return cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post("/upload", upload.single("file"), (req, res) => {
  const { title, description } = req.body;
  const fileName = req.file.originalname;
  const filePath = path.join(__dirname, "public/images", fileName);

  // Store book details in the books array
  books.push({
    title,
    description,
    coverImage: `/public/cover/${fileName}`, // Store the relative path to the cover image
    pdfFile: `/download/${fileName}`, // Store the relative path to the PDF file
  });

  res.send("File uploaded successfully!");
});

app.get("/", (req, res) => {
  res.send("Hello, your server is running!");
});

app.get("/download/:filename", (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, "public/images", fileName);

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(404).send("File not found");
    }
  });
});

// Get the list of uploaded files
app.get("/uploaded-books", (req, res) => {
  console.log("Request received on /uploaded-books");
  res.json(books);
});

// New route for cover image upload
app.post("/upload-cover-image", handleCoverImageUpload);

const port = 3001;

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
