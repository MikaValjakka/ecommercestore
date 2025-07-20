import { redis } from "../lib/redis.js";
import User from "../models/user.model.js";
import jwt, { decode } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

const storeRefreshToken = async (userId, refreshToken) => {
  await redis.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );
};

const setCookies = (res, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const signup = async (req, res) => {
  const { email, password, name } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = await User.create({ name, email, password });

    const { accessToken, refreshToken } = generateTokens(user._id);
    await storeRefreshToken(user._id, refreshToken);

    setCookies(res, accessToken, refreshToken);

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.email,
      },
      message: "User created successfully",
    });
    //res.send("Inside route signup");
  } catch (error) {
    console.log("Signup error", error);
    res.status(400).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ensure email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Try to find the user by email
    const user = await User.findOne({ email });

    // If user not found or password doesn't match, send 401 Unauthorized
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Generate access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Store the refresh token in Redis with user ID as the key
    await storeRefreshToken(user._id, refreshToken);

    // Set cookies for accessToken and refreshToken
    setCookies(res, accessToken, refreshToken);

    // Send success response with user details
    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role, // Can change role logic later if needed
      },
      message: "User logged in successfully.",
    });
  } catch (error) {
    // Handle any unexpected errors
    res.status(500).json({ message: "Server error.", error: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const decoded = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );
      await redis.del(`refresh_token:${decoded.userId}`);
    }

    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    // If no refresh token is provided, return 401 Unauthorized
    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    // Verify the refresh token using the secret key
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Retrieve the stored refresh token from Redis
    const storedToken = await redis.get(`refresh_token:${decoded.userId}`);

    // If token in Redis does not match the provided token, reject the request
    if (!storedToken || storedToken !== refreshToken) {
      return res
        .status(401)
        .json({ message: "Invalid or expired refresh token" });
    }

    // Generate a new access token (valid for 15 minutes)
    const accessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15m" }
    );

    // Set the new access token in an HTTP-only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    // Respond with the new access token
    res.status(200).json({
      message: "Access token refreshed successfully",
      //accessToken, // Optional: send it in response body if needed
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
