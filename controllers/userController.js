const bcrypt = require("bcrypt");
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
// Body: { data }

exports.userLogin = (req, res) => {
  res.status(200).json({
    msg: "Success",
  });
};

// ==================== PROFILE ====================

// GET http://localhost:3000/profile

exports.userProfile = (req, res) => {
  res.status(200).json("PROFILE HIT");
};
