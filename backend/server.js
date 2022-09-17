const express = require('express')
const cors = require('cors')
const {errorHandler} = require('./middleware/errorMiddleware')
const connectDB = require('./config/db')
const dotenv = require('dotenv').config()
const colors = require('colors')
const port = process.env.port || 5000

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

// app.use("/v1/api/courses", require('./api/courses.route'))
app.use("/v1/api/companies", require('./api/companies.route'))
app.use("/v1/api/accounts", require('./api/accounts.route'))
app.use("*", (req, res) => res.status(404).json({error: "not found"}))
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`));
