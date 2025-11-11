const User = require("../models/User");
const jwt = require("jsonwebtoken");
const protect = require("../middleware/authMiddleware");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "365d" });
};

// Register User
exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body;
  console.log("Before", req.body);
  // Validation Check for missing fields
  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if email already exist
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Create the User
    const user = new User({
      fullName,
      email,
      password,
      profileImageUrl,
    });
    await user.save();
    console.log("After", req.body);

    res
      .status(201)
      .json({ id: user._id, user, token: generateToken(user._id) });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error registering user", error: err.message });
  }
};

// Login User
exports.loginUser = async (req, res) => {
  console.log("In the login user ==", req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await User.findOne({ email });

    // Checks user exists or not and password is correct or not
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({
      id: user._id,
      user,
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({ message: "Error loging user", error: err });
  }
};

// getUserInfo
exports.getUserInfo = async (req, res) => {
  console.log("In the userinfo ", req);
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    console.log("In the getInfo user =", user);
    res.status(200).json(user);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error while fetching user info.", error: err });
  }
};
