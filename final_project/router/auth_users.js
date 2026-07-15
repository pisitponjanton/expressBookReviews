const express = require("express");
const jwt = require("jsonwebtoken");
const books = require("./booksdb.js");

const regdUsers = express.Router();
const users = [];

const isValid = (username) => {
  return users.some((user) => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (user) =>
      user.username === username &&
      user.password === password
  );
};

regdUsers.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: "Invalid username or password",
    });
  }

  const accessToken = jwt.sign(
    { username },
    "access",
    { expiresIn: "1h" }
  );

  req.session.authorization = {
    accessToken,
    username,
  };

  return res.status(200).json({
    message: "User successfully logged in",
    accessToken,
  });
});

regdUsers.put("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const review = req.query.review || req.body.review;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  if (!review) {
    return res.status(400).json({
      message: "Review is required",
    });
  }

  books[isbn].reviews[username] = review;

  return res.status(200).json({
    message: "Review successfully added or updated",
    reviews: books[isbn].reviews,
  });
});

regdUsers.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization.username;

  if (!books[isbn]) {
    return res.status(404).json({
      message: "Book not found",
    });
  }

  if (!books[isbn].reviews[username]) {
    return res.status(404).json({
      message: "Review not found",
    });
  }

  delete books[isbn].reviews[username];

  return res.status(200).json({
    message: "Review successfully deleted",
  });
});

module.exports.authenticated = regdUsers;
module.exports.isValid = isValid;
module.exports.users = users;
