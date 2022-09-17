import express from "express"
import cors from "cors"
import courses from "./api/courses.route.js"
import errorHandler from "./middleware/errorMiddleware.js"
import connectDB from "./config/db.js"
import dotenv from "dotenv"

const port = process.env.port || 5000

dotenv.config()
connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.use("/v1/api/courses", courses)
app.use("*", (req, res) => res.status(404).json({error: "not found"}))
app.use(errorHandler)

app.listen(port, () => console.log(`Server started on port ${port}`));

export default app