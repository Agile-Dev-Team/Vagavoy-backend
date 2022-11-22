import express from "express"
import authRouter from './auth.js'
import userRouter from './users.js'
import travelRouter from './travel.js'
import connectionRouter from './connection.js'

var router = express.Router()

router
  .use('/auth', authRouter)
  .use('/user', userRouter)
  .use('/travel', travelRouter)
  .use('/connection', connectionRouter)

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "asdf" });
});

export default router;
// module.exports = router
