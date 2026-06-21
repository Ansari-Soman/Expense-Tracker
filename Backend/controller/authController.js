const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("../utils/emailService");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "365d" });
};

// Generate 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Register User
exports.registerUser = async (req, res) => {
  const { fullName, password, profileImageUrl } = req.body;
  const email = req.body.email?.trim().toLowerCase();
  
  // Validation Check for missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Please enter a valid email address" });
  }

  // Validate password strength
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email });

    const otp = generateOtp();
    const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Overwrite unverified user registration details
      existingUser.fullName = fullName;
      existingUser.password = password; // hashes in pre-save hook
      existingUser.profileImageUrl = profileImageUrl;
      existingUser.otp = otp;
      existingUser.otpExpires = otpExpires;
      await existingUser.save();

      // Send OTP Email
      await sendEmail({
        to: email,
        subject: "Expense Tracker - Verify Your Account",
        html: `<h3>Welcome back!</h3><p>Your verification code is: <b>${otp}</b></p><p>It will expire in 15 minutes.</p>`
      });

      return res.status(200).json({
        message: "Verification OTP sent to your email",
        email,
        otp: !process.env.RESEND_API_KEY ? otp : undefined // Dev mode helper
      });
    }

    // Create the User (unverified)
    const user = new User({
      fullName,
      email,
      password,
      profileImageUrl,
      isVerified: false,
      otp,
      otpExpires,
    });
    await user.save();

    // Send OTP Email
    await sendEmail({
      to: email,
      subject: "Expense Tracker - Verify Your Account",
      html: `<h3>Welcome!</h3><p>Thank you for signing up. Your verification code is: <b>${otp}</b></p><p>It will expire in 15 minutes.</p>`
    });

    res.status(201).json({
      message: "Verification OTP sent to your email",
      email,
      otp: !process.env.RESEND_API_KEY ? otp : undefined // Dev mode helper
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { password } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    // Checks user exists or not and password is correct or not
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Checks if user is verified
    if (!user.isVerified) {
      // Auto-generate and resend OTP for login convenience
      const otp = generateOtp();
      user.otp = otp;
      user.otpExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      await sendEmail({
        to: email,
        subject: "Expense Tracker - Verify Your Account",
        html: `<p>Your verification code is: <b>${otp}</b></p><p>It will expire in 15 minutes.</p>`
      });

      return res.status(403).json({
        message: "Email not verified. A verification OTP has been sent.",
        isVerified: false,
        email,
        otp: !process.env.RESEND_API_KEY ? otp : undefined // Dev mode helper
      });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error logging user", error: err.message });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(200).json({
        message: "Email is already verified",
        id: user._id,
        user,
        token: generateToken(user._id),
      });
    }

    if (user.otp !== otp || user.otpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    res.status(200).json({
      message: "Email verified successfully",
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error verifying OTP", error: err.message });
  }
};

// Resend OTP
exports.resendOtp = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "User is already verified" });
    }

    const otp = generateOtp();
    user.otp = otp;
    user.otpExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendEmail({
      to: email,
      subject: "Expense Tracker - Verification Code Resent",
      html: `<p>Your verification code is: <b>${otp}</b></p><p>It will expire in 15 minutes.</p>`
    });

    res.status(200).json({
      message: "OTP sent successfully",
      otp: !process.env.RESEND_API_KEY ? otp : undefined // Dev mode helper
    });
  } catch (err) {
    res.status(500).json({ message: "Error resending OTP", error: err.message });
  }
};

// Forgot Password Request
exports.forgotPassword = async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const otp = generateOtp();
    user.resetOtp = otp;
    user.resetOtpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins
    await user.save();

    await sendEmail({
      to: email,
      subject: "Expense Tracker - Password Reset Verification Code",
      html: `<h3>Password Reset requested</h3><p>Your verification code is: <b>${otp}</b></p><p>It will expire in 15 minutes.</p>`
    });

    res.status(200).json({
      message: "Password reset OTP sent to your email",
      otp: !process.env.RESEND_API_KEY ? otp : undefined // Dev mode helper
    });
  } catch (err) {
    res.status(500).json({ message: "Error in forgot password request", error: err.message });
  }
};

// Reset Password Execution
exports.resetPassword = async (req, res) => {
  const { otp, newPassword } = req.body;
  const email = req.body.email?.trim().toLowerCase();

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.resetOtp !== otp || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired reset OTP" });
    }

    // Reset password
    user.password = newPassword; // hashes in pre-save hook
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful. You can now log in." });
  } catch (err) {
    res.status(500).json({ message: "Error resetting password", error: err.message });
  }
};

// getUserInfo
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while fetching user info.", error: err.message });
  }
};
