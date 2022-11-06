const express = require("express");
const mongoSanitize = require("express-mongo-sanitize"); // [Sanitization] Prevent NoSQL injection
const cors = require("cors");
const { errorHandler } = require("./middleware/errorMiddleware");
const { connectDB } = require("./config/db");
// const {recaptcha} =require("./config/recaptchsa");
const dotenv = require("dotenv").config();
const port = process.env.port || 5000;
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const requestIp = require("request-ip"); // [DoS] Prevent brute force attacks

connectDB();

const app = express();

module.exports = { app };

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(requestIp.mw()); // [DoS] Prevent brute force attacks
// parse application/x-www-form-urlencoded, false can only parse incoming Request Object of strings or arrays
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));

app.use(bodyParser.json());

app.use(
  mongoSanitize({
    // [Sanitization] Prevent NoSQL injection
    onSanitize: ({ req, key }) => {
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
