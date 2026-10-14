const books = require("../models/bookModel");

// ADD BOOK: BY USER

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

// LATEST BOOKS LIST: LIST 4 LATEST BOOKS

// exports.latestBooks = async (req, res) => {
//   try {
//     const latestBooks = await books.find().sort({ createdAt: -1 }).limit(4);
//     res.status(200).json(latestBooks);
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching latest books", error: err });
//   }
// };

exports.latestBooks = async (req, res) => {
  // const latestbooklist = await books.find();
  // res.status(200).json(latestbooklist.slice(0, 4));
  const latestbooklist = await books
    .find({ status: "approved" })
    .sort({ createdAt: -1 })
    .limit(4);
  res.status(200).json(latestbooklist);
};

// LIST BOOKS: IGNORE BOOKS ADDED BY LOGGED IN USER

// exports.listBooks = async (req, res) => {
//   try {
//     const allBooks = await books.find({
//       sellerMail: { $ne: req.payload.userMail }
//     });
//     res.status(200).json(allBooks);
//   } catch (err) {
//     res.status(500).json({ msg: "Error fetching books", error: err });
//   }
// };

exports.bookList = async (req, res) => {
  try {
    const mail = req.payload?.userMail;
    const booklist = await books.find({
      sellerMail: { $ne: mail },
    });
    res.status(200).json(booklist);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch books",
      error: error.message,
    });
  }
};

// LIST BOOKS: LIST BOOKS ADDED BY USER

exports.userAddedBook = async (req, res) => {
  const mail = req.payload?.userMail;
  const booklist = await books.find({ sellerMail: mail });
  res.status(200).json(booklist);
};

// REMOVE BOOKS BY USER: BEFORE ADMIN APPROVES IT

exports.deleteAddedBook = async (req, res) => {
  const { bid } = req.params;
  const deletedBook = await books.findByIdAndDelete(bid);
  res.status(200).json(deletedBook);
};

// PURCHASED BOOKS BY THE LOGGED IN USER

exports.purchasedBookList = async (req, res) => {
  const mail = req.payload?.userMail;
  const purchasedBookList = await books.find({ buyerMail: mail });
  return res.status(200).json(purchasedBookList);
};
