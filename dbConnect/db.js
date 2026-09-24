// Import Mongoose to connect the application with MongoDB
const mongoose = require("mongoose");

// Get the MongoDB connection string from the environment variables
const connection_string = process.env.CONNECTION_STRING;

// Connect to MongoDB using the connection string
mongoose
  .connect(connection_string)

  // Runs when the MongoDB connection is successful
  .then(() => {
    console.log("Server connected with MongoDB server");
  })

  // Runs when the MongoDB connection fails
  .catch((err) => {
    console.log("MongoDB connection failed");
    console.log(err);
  });
