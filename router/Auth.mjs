import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { findUserByEmail,findUserByUsername, createUser } from '../models/userModel.mjs'; 
import { Router } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const AuthRouter = Router(); 

AuthRouter.post("/register", async (req, res) => {
  const { name, username, email, password, role } = req.body;
  try {
    const existingEmail = await findUserByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ field: "email", message: "Email already in use" });
    }

    const existingUsername = await findUserByUsername(username);
    if (existingUsername) {
      return res.status(400).json({ field: "username", message: "Username already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await createUser(name, username, email, hashedPassword, role);
    res.status(201).json({ message: 'User registered', user: { id: user.id, email: user.email } });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

AuthRouter.post("/login", async (req, res) => { 
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, });
  } catch (error) {
    console.error("Login error:", error); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

AuthRouter.post("/loginAdmin", async (req, res) => { 
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });
    if (user.role !== "admin") return res.status(403).json({ message: 'Access denied: Admins only' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token, });
  } catch (error) {
    console.error("Login error:", error); // Log error for debugging
    res.status(500).json({ message: 'Server error' });
  }
});

export default AuthRouter; 