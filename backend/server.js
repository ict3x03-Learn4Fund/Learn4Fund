const express = require("express");
const mongoSanitize = require("express-mongo-sanitize"); // [Sanitization] Prevent NoSQL injection
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const { connectDB } = require("./config/db");
// const {recaptcha} =require("./config/recaptchsa");
const dotenv = require("dotenv").config();
const colors = require("colors");
const port = process.env.port || 5000;
const { GridFsStorage } = require("multer-gridfs-storage");
const { default: mongoose } = require("mongoose");
const Grid = require("gridfs-stream");
const methodOverride = require("method-override");
const multer = require("multer");
const bodyParser = require("body-parser");
const e = require("express");
const Mockgoose = require("mockgoose").Mockgoose;
const mockgoose = new Mockgoose(mongoose);

connectDB();
// recaptcha();

const app = express();

module.exports = { app };

// TODO: Uncomment this line in production
// app.set('trust proxy', 2);                                 // [DoS] trust 2 , cloudflare and nginx

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
// parse application/x-www-form-urlencoded, false can only parse incoming Request Object of strings or arrays
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
// app.set("view engine", "ejs");

app.use(bodyParser.json());
//for recaptcha
// app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  mongoSanitize({
    // [Sanitization] Prevent NoSQL injection
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req);
    },
  })
);

app.use("/v1/api/courses", require("./api/courses.route"));
app.use("/v1/api/companies", require("./api/companies.route"));
app.use("/v1/api/accounts", require("./api/accounts.route"));
app.use("/v1/api/images", require("./api/images.route"));
app.use("/v1/api/carts", require("./api/carts.route"));
app.use("/v1/api/admin", require("./api/admin.route")); // [Logging & Alert] Admin APIs
app.use("/v1/api/reviews", require("./api/reviews.route"));
app.use("/v1/api/payments", require("./api/payments.route"));
app.use("/v1/api/donations", require("./api/donations.route"));

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
