const books = require("../models/bookModel");

// ADD BOOK : BY USER

exports.addBook = async (req, res) => {
  console.log("Inside the add book controller function");

  const {
    title,
    author,
    noOfPages,
    imageUrl,
    price,
    discountPrice,
    abstract,
    publisher,
    language,
    isbn,
    category,
  } = req.body;

  const sellerMail = req.payload?.userMail;

  const uploadedImages = (req.files || []).map((item) => item.filename);

  console.log("Book Details:", {
    title,
    author,
    noOfPages,
    imageUrl,
    price,
    discountPrice,
    abstract,
    publisher,
    language,
    isbn,
    category,
  });

  console.log("Seller Mail:", sellerMail);
  console.log("Uploaded Images:", uploadedImages);

  const existingBook = await books.findOne({ sellerMail, isbn });

  if (existingBook) {
    return res.status(400).json({
      msg: "Book already added!",
    });
  } else {
    const newbook = await books.create({
      title,
      author,
      noOfPages,
      imageUrl,
      price,
      discountPrice,
      abstract,
      publisher,
      language,
      isbn,
      category,
      uploadedImages,
      sellerMail,
    });

    return res.status(200).json(newbook);
  }
};
