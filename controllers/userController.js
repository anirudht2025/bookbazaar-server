const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../Models/userModel");

// ==================== REGISTER ====================

// POST http://localhost:3000/register
// Body: { username, email, password }

exports.userRegister = async (req, res) => {
  console.log("Inside the register controller function");

  const { username, email, password } = req.body;

  // Check whether all required fields are provided
  if (username && email && password) {
    try {
      // Check if the user already exists
      const existingUser = await users.findOne({ email });

      if (existingUser) {
        return res.status(403).json({
          msg: "User Already Exists!!",
        });
      } else {
        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user in MongoDB
        const response = await users.create({
          username,
          email,
          password: hashedPassword,
          // role: "admin"
        });

        // Send the created user as the response
        return res.status(201).json(response);
      }
    } catch (err) {
      console.log(err);

      return res.status(400).json(err);
    }
  } else {
    // Send an error if required data is missing
    return res.status(400).json({
      msg: "Enter valid data",
    });
  }
};

// ==================== LOGIN ====================

// POST http://localhost:3000/login
// Body: { email, password }

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      console.log(existingUser);

      const passwordResult = await bcrypt.compare(
        password,
        existingUser.password,
      );

      if (passwordResult) {
        const token = jwt.sign(
          {
            userId: existingUser._id,
            userMail: existingUser.email,
          },
          process.env.SECRET_KEY,
        );

        return res.status(200).json({
          msg: "Login Successful",
          token: token,
        });
      } else {
        return res.status(401).json({
          msg: "Invalid Email/Password",
        });
      }
    } else {
      return res.status(401).json({
        msg: "Invalid Email/Password",
      });
    }
  } catch (err) {
    console.log(err);

    return res.status(500).json({
      msg: "Server Error",
    });
  }
};

// ==================== PROFILE ====================

// GET http://localhost:3000/profile

exports.userProfile = (req, res) => {
  res.status(200).json("PROFILE HIT");
};
