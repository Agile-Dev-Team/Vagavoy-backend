import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import Joi from '@hapi/joi'

const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().min(3).required().email(),
  password: Joi.string().min(6).required(),
})

const loginSchema = Joi.object({
  email: Joi.string().min(6).required().email(),
  password: Joi.string().min(6).required()
})

export const register = async (req, res) => {
  
  // CHECKING IF USER EMAIL ALREADY EXISTS
  const emailExist = await User.findOne({ email: req.body.email })
  // IF EMAIL EXISTS THEN RETURN
  if (emailExist) {
    res.status(400).send('Email already exists')
    return
  }

  // HASHING THE PASSWORD

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.password, salt)

  // ON PROCESS OF ADDING NEW USER

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword
  })

  try {
    // VALIDATION OF USER INPUTS

    const { error } = await registerSchema.validateAsync(req.body)
    
    if (error) {
      res.status(400).send(error.details[0].message)
      return
    } else {
      const saveUser = await user.save()
      res.status(200).send('user created');
    }
  } catch (error) {
    res.status(500).send(error)
  }
}

export const login = async (req, res) => {
  
  // CHECKING IF EMAIL EXISTS

  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send("Incorrect Email")

  // CHECKING IF USER PASSWORD MATCHES

  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send("Incorrect Password")

  try {
    // VALIDATION OF USER INPUTS

    const { error } = await loginSchema.validateAsync(req.body)
    if (error) return res.status(400).send(error.details[0].message)
    else {
      const payload = {
        id: user._id,
        name: user.name,
        email: user.email,
      }
      jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: 24*3600},
        (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token,
            _id: user._id,
            name: user.name,
            email: user.email,
          })
        }
      )
      // res.header('auth-token', token).send(token)
    }
  } catch (err) {
    res.status(500).send(err)
  }
}

const authController = {
  login,
  register
}
export default authController