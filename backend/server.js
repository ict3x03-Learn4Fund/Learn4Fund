const express = require("express");
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const {connectDB} = require("./config/db");
const dotenv = require("dotenv").config();
const colors = require("colors");
const port = process.env.port || 5000;
const { GridFsStorage } = require("multer-gridfs-storage");
const { default: mongoose } = require("mongoose");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const multer = require('multer')
const bodyParser = require('body-parser');

connectDB();


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.set("view engine", "ejs");


app.use(bodyParser.json());

app.use("/v1/api/courses", require("./api/courses.route"));
app.use("/v1/api/companies", require("./api/companies.route"));
app.use("/v1/api/accounts", require("./api/accounts.route"));
app.use("/v1/api/images", require("./api/images.route"));
app.use("/v1/api/carts", require("./api/carts.route"));
app.use("*", (req, res) => res.status(404).json({ error: "not found" }));
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
