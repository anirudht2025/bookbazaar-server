// Define the Book schema that specifies the structure and validation rules for book documents
const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  noOfPages: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  abstract: {
    type: String,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    required: true,
  },
  isbn: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  uploadedImages: {
    type: Array,
    required: true,
  },
  sellerMail: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  buyerMail: {
    type: String,
    default: "",
  },
});

// Create a Book model using the bookSchema to interact with the books collection
const books = mongoose.model("books", bookSchema);

// Export the books model so it can be used in other files
module.exports = books;
