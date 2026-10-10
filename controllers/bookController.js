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
  const latestbooklist = await books.find().sort({ createdAt: -1 }).limit(4);
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

exports.listBooks = async (req, res) => {
  const listuserbooks = await books.find({
    sellerMail: { $ne: req.payload.userMail },
  });
  res.status(200).json(listuserbooks);
};
