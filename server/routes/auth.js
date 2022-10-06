import express from 'express'
import authController from '../controllers/authController.js'

const router = express.Router()



router.get('/test', async (req, res) => {
  res.send("sdfasdf")
})

// SIGNUP USER
router.post('/register', authController.register)

// LOGIN USER
router.post('/login', authController.login)

export default router;