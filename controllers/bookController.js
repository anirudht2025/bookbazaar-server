const books = require("../models/bookModel");

const stripe = require("stripe")(process.env.STRIPE_SK);
console.log("Stripe secret key loaded:", !!process.env.STRIPE_SK);

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

// VIEW BOOK DETAILS OF A SPECIFIC BOOK

exports.getBookById = async (req, res) => {
  const { bid } = req.params;
  const bookDetail = await books.findById(bid);
  return res.status(200).json(bookDetail);
};

// BOOK PAYMENT

exports.bookPayment = async (req, res) => {
  console.log("Inside book payment");

  const buyerMail = req.payload?.userMail;
  const { bid } = req.params;
  const bookDetail = await books.findById(bid);

  console.log("Book details:", bookDetail);

  bookDetail.status = "sold";
  bookDetail.buyerMail = buyerMail;

  await bookDetail.save();

  // CREATE STRIPE CHECKOUT SESSION
  console.log("Creating Stripe Checkout Session...");

  const line_items = [
    {
      price_data: {
        currency: "inr",
        product_data: {
          name: bookDetail.title,
          description: `${bookDetail.author} - ${bookDetail.publisher}`,
          // images: bookDetail.uploadedImages,
          metadata: {
            title: bookDetail.title,
            author: bookDetail.author,
            price: String(bookDetail.discountPrice),
          },
        },
        unit_amount: Math.round(bookDetail.discountPrice * 100),
      },
      quantity: 1,
    },
  ];

  // console.log("Stripe key starts with:", process.env.STRIPE_SK?.substring(0, 7));

  try {
    const session = await stripe.checkout.sessions.create({
      success_url: "http://localhost:5173/success",
      cancel_url: "http://localhost:5173/failed",
      line_items,
      mode: "payment",
    });
    return res.status(200).json(session);
  } catch (error) {
    console.log("STRIPE ERROR:", error.message);
    return res.status(500).json({ message: error.message });
  }
};

// ==================== ADMIN ====================

// GET ALL BOOKS FOR ADMIN

exports.getAdminAllBooks = async (req, res) => {
  const allBooks = await books.find();
  return res.status(200).json(allBooks);
};

// UPDATE BOOK STATUS

exports.approveBook = async (req, res) => {
  const { bid } = req.params;
  const bookDetail = await books.findById(bid);
  bookDetail.status = "approved";
  await bookDetail.save();
  res.status(200).json(bookDetail);
};
