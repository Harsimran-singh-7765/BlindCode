import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin'

const router = express.Router()

// POST /auth/register (For admins only)
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body

    const existing = await Admin.findOne({ $or: [{ email }, { name }] })
    if (existing) {
      res.status(400).json({ message: 'Email or Username already registered' })
      return
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const admin = await Admin.create({ name, email, passwordHash })

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

    res.status(201).json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

// POST /auth/login
// Accepts { email, password } OR { username, password }
// Frontend Login.tsx uses username field — we treat username as email
router.post('/login', async (req, res) => {
  try {
    const { email, username, password } = req.body
    const emailOrUsername = email || username  // support both fields

    if (!emailOrUsername || !password) {
      res.status(400).json({ message: 'Username and password are required' })
      return
    }

    // Allow lookup by email or by name (for username-style login)
    const admin = await Admin.findOne({
      $or: [
        { email: emailOrUsername },
        { name: emailOrUsername }
      ]
    })

    if (!admin) {
      res.status(400).json({ message: 'Invalid username or password' })
      return
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash)
    if (!isMatch) {
      res.status(400).json({ message: 'Invalid username or password' })
      return
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET!, { expiresIn: '7d' })

    res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email }
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Server error' })
  }
})

export default router
