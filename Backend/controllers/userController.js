import dotenv from "dotenv";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

dotenv.config();

const SALT_ROUNDS = 10;
const JWT_SECRET = process.env.JWT_SECRET;

// Register User
export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User created", userId: newUser._id });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare the password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000, // 1 hour
    });

    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
