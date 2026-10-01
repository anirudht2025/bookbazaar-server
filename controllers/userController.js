const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../Models/userModel");

// ==================== REGISTER ====================

exports.userRegister = async (req, res) => {
  console.log("Inside the register controller function");

  const { username, email, password } = req.body;

  if (username && email && password) {
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(403).json({
        msg: "User Already Exists!!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const response = await users.create({
      username,
      email,
      password: hashedPassword,
      // role: "admin"
    });

    return res.status(201).json(response);
  }

  return res.status(400).json({
    msg: "Enter valid data",
  });
};

// ==================== LOGIN ====================

exports.userLogin = async (req, res) => {
  const { email, password } = req.body;

  const existingUser = await users.findOne({ email });

  if (existingUser) {
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
        user: existingUser,
      });
    }

    return res.status(401).json({
      msg: "Invalid Email/Password",
    });
  }

  return res.status(401).json({
    msg: "Invalid Email/Password",
  });
};

// ==================== GOOGLE LOGIN ====================

exports.googleLogin = async (req, res) => {
  const { email, name, picture } = req.body;

  const existingUser = await users.findOne({ email });

  if (existingUser) {
    const token = jwt.sign(
      {
        userId: existingUser._id,
        userMail: existingUser.email,
      },
      process.env.SECRET_KEY,
    );

    return res.status(200).json({
      msg: "Google Login Successful",
      token: token,
      user: existingUser,
    });
  }

  const newUser = await users.create({
    username: name,
    email,
    password: "123",
    picture: picture,
  });

  const token = jwt.sign(
    {
      userId: newUser._id,
      userMail: newUser.email,
    },
    process.env.SECRET_KEY,
  );

  return res.status(200).json({
    msg: "Google Login Successful",
    token: token,
    user: newUser,
  });
};

// ==================== PROFILE ====================

exports.profileEdit = async (req, res) => {
  // console.log(req.body);
  // console.log(req.file);
  // console.log(req.params);
  // console.log(req.query);
  // console.log(req.payload);
  const { username, email, password, bio } = req.body;

  const id = req.payload.userId;

  const picture = req.file?.filename;

  const encryptedPassword = await bcrypt.hash(password, 10);

  const updatedUser = await users.findByIdAndUpdate(
    { _id: id },

    { username, email, password: encryptedPassword, picture, bio },

    { returnDocument: "after" }
    // { new: true },
  );

  res.status(200).json(updatedUser);
};
