// Define the User schema that specifies the structure and validation rules for user documents
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    default: "",
  },
  bio: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
  },
});

// Create a User model using the userSchema to interact with the users collection
const users = mongoose.model("users", userSchema);

// Export the users model so it can be used in other files
module.exports = users;
