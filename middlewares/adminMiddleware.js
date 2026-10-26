const jwt = require("jsonwebtoken");

const adminMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const verifiedData = jwt.verify(token, process.env.SECRET_KEY);

    req.payload = verifiedData;

    if (verifiedData.role === "admin") {
      next();
    } else {
      res.status(403).json("Invalid Usertype!");
    }
  } catch (err) {
    console.log(err);

    return res.status(403).json({
      msg: "Authorization Failed",
    });
  }
};

module.exports = adminMiddleware;
