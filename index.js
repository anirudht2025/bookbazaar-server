// Load environment variables from the .env file
require("dotenv").config();

// Establish connection with MongoDB
require("./dbConnect/db");

// Import Express
const express = require("express");

// Import CORS to allow requests from different origins
const cors = require("cors");

// Import user routes
const userRoutes = require("./routes/routes");

// Create an Express server
const server = express();

// Enable CORS
server.use(cors());

// Parse incoming JSON request bodies
server.use(express.json());

// Use user routes
server.use("/", userRoutes);

// Get the port number from environment variables
const PORT = process.env.PORT;

// Start the Express server
server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} & Waiting for client requests!`
  );
});
