require("dotenv").config();
const User = require("../model/user.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET

// Create and Save a new User
exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    res.json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

// login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: "Login failed" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Login failed" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ message: "Error logging in", error });
  }
};

// Retrieve and return all users from the database. xxxx
exports.findAll = (req, res) => {
  User.findAll()
    .then((users) => {
      console.log(users);
      res.send(users);
    })
    .catch((err) => {
      console.error("Error:", err);
    });
};

// Find a single user with a userId
exports.findOne = (req, res) => {
  // TODO: Add your logic here
};

// Update a user identified by the userId in the request
exports.update = (req, res) => {
  // TODO: Add your logic here
};

// Delete a user with the specified userId in the request
exports.delete = (req, res) => {
  // TODO: Add your logic here
};
