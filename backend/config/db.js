const mongoose = require("mongoose");
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const asyncHandler = require("express-async-handler")
const Grid = require("gridfs-stream")
const crypto = require("crypto");
const dotenv = require("dotenv").config();
const path = require('path')

let gfs, gridFsStorage;
const connectDB = async () => {
  try {
    const conn = mongoose.createConnection(process.env.COURSES_DB_URI);
    conn.once("open", () => {
      // gfs =   Grid(conn.db, mongoose.mongo);
      // gfs.collection("uploads");

      gfs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: "uploads",
      });
      console.log(`MongoDB Connected for gridfs: ${conn.host}`);

    });
    const conn2 = await mongoose.connect(process.env.COURSES_DB_URI);
    console.log(`MongoDB Connected: ${conn2.connection.host}`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

// Create storage engine
const storage = new GridFsStorage({
  url: process.env.COURSES_DB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString("hex") + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: "uploads",
        };
        resolve(fileInfo);
      });
    });
  },
});
const store = multer({ storage });

const uploadMiddleware = (req, res, next) => {
  const upload = store.single('image');
  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(400).send('File too large');
    } else if (err) {
      // check if our filetype error occurred
      if (err === 'filetype') return res.status(400).send('Image files only');
      // An unknown error occurred when uploading.
      return res.status(500).json({err: err});
    }
    // all good, proceed
    next();
  });
}

const apiUpload = asyncHandler(async (req,res) => {
  const {file} = req;
  const {id} = file;
  console.log('uploaded file: ', file)
  return res.status(200).json({id: file.id})
})

const apiGetImg = asyncHandler((req, res) => {
  const _id = new mongoose.Types.ObjectId(req.params.id);
  gfs.find({ _id }).toArray((err, file) => {
    // Check if file
    if (!file || file.length === 0) {
      return res.status(404).json({ 
        err: "No file exists",
      });
    }
    // Check if image
    if (file[0].contentType === "image/jpeg" || file[0].contentType === "image/png") {
      // Read output to browser
      const readstream = gfs.openDownloadStream(_id);
      readstream.pipe(res);
    } else {
      res.status(404).json({
        err: "not an image",
      });
    }
  });
});

const deleteImage = (id) => {
  if (!id || id === 'undefined') return res.status(400).send('no image id');
  const _id = new mongoose.Types.ObjectId(id);
  gfs.delete(_id, (err) => {
    if (err) return res.status(500).send('image deletion error');
  });
};

module.exports = { connectDB, store, apiGetImg, deleteImage, uploadMiddleware, apiUpload };
