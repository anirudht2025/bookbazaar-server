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

// Import JWT middleware
// const jwtMiddleware = require("./middlewares/jwtMiddleware");

// Create an Express server
const server = express();

// Enable CORS
server.use(cors());

// Parse incoming JSON request bodies
server.use(express.json());

// Apply JWT middleware to incoming requests
// server.use(jwtMiddleware);

// Serve uploaded images
server.use("/uploads", express.static("uploads"));

// Use user routes
server.use("/", userRoutes);

// Handling global errors using application-level middleware
server.use((err, req, res, next) => {
  res.status(500).json(err);
});

// Get the port number from environment variables
const PORT = process.env.PORT;

// Start the Express server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT} & Waiting for client requests!`);
});
