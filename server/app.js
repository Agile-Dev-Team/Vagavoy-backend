import express from "express"
import path, { dirname } from "path"
import cookieParser from "cookie-parser"
import logger from "morgan"
import cors from 'cors'
import dotenv from 'dotenv'
import { fileURLToPath } from "url"
import mongoose from "mongoose"
import passport from "passport"

import indexRouter from "./routes/index.js"
import passportConfig from "./config/passport.js"

const app = express()
const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config()
const port = process.env.PORT || 3000

mongoose
  .connect( process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true } )
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err))

app.use(logger("dev"))
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, "../public")))
app.use(passport.initialize())

// Passport config
passportConfig(passport);

app.use("/", indexRouter)

app.listen(port, () => console.log(`Server started on port ${port}`));

export default app;
