const express = require("express");
const books = require("./booksdb.js");
const { isValid, users } = require("./auth_users.js");

const publicUsers = express.Router();

// Register a new user
publicUsers.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (!isValid(username)) {
    users.push({ username, password });

    return res.status(200).json({
      message: "User successfully registered. Now you can login",
    });
  }

  return res.status(409).json({
    message: "User already exists",
  });
});

// Task 2: Get all books
publicUsers.get("/", async (req, res) => {
  try {
    const result = await Promise.resolve(books);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 3: Get book by ISBN
publicUsers.get("/isbn/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 4: Get books by author
publicUsers.get("/author/:author", async (req, res) => {
  try {
    const author = req.params.author.toLowerCase();

    const matchingBooks = await Promise.resolve(
      Object.entries(books).reduce((result, [isbn, book]) => {
        if (book.author.toLowerCase().includes(author)) {
          result[isbn] = book;
        }
        return result;
      }, {})
    );

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 5: Get books by title
publicUsers.get("/title/:title", async (req, res) => {
  try {
    const title = req.params.title.toLowerCase();

    const matchingBooks = await Promise.resolve(
      Object.entries(books).reduce((result, [isbn, book]) => {
        if (book.title.toLowerCase().includes(title)) {
          result[isbn] = book;
        }
        return result;
      }, {})
    );

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Task 6: Get reviews by ISBN
publicUsers.get("/review/:isbn", async (req, res) => {
  try {
    const isbn = req.params.isbn;
    const book = await Promise.resolve(books[isbn]);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    return res.status(200).json(book.reviews);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports.general = publicUsers;
