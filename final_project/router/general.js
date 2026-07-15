const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");

const {
  isValid,
  users,
} = require("./auth_users.js");

const publicUsers = express.Router();
const BASE_URL = "http://localhost:5000";

// Task 7: Register
publicUsers.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required",
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists",
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered. Now you can login",
  });
});

// Task 2: Get all books
publicUsers.get("/", async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// Task 3: Get book by ISBN
publicUsers.get("/isbn/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json(book);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// Task 4: Get books by author
publicUsers.get("/author/:author", async (req, res) => {
  try {
    const requestedAuthor =
      req.params.author.toLowerCase();

    const matchingBooks = Object.fromEntries(
      Object.entries(books).filter(([, book]) =>
        book.author
          .toLowerCase()
          .includes(requestedAuthor)
      )
    );

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// Task 5: Get books by title
publicUsers.get("/title/:title", async (req, res) => {
  try {
    const requestedTitle =
      req.params.title.toLowerCase();

    const matchingBooks = Object.fromEntries(
      Object.entries(books).filter(([, book]) =>
        book.title
          .toLowerCase()
          .includes(requestedTitle)
      )
    );

    return res.status(200).json(matchingBooks);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

// Task 6: Get book reviews
publicUsers.get("/review/:isbn", async (req, res) => {
  try {
    const { isbn } = req.params;
    const book = books[isbn];

    if (!book) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    return res.status(200).json(book.reviews);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

/*
 * Axios and async/await implementations
 * required for the asynchronous retrieval tasks.
 */

async function getAllBooksUsingAxios() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    return response.data;
  } catch (error) {
    throw new Error(
      `Unable to retrieve books: ${error.message}`
    );
  }
}

function getBookByISBNUsingAxios(isbn) {
  return axios
    .get(
      `${BASE_URL}/isbn/${encodeURIComponent(isbn)}`
    )
    .then((response) => response.data)
    .catch((error) => {
      throw new Error(
        `Unable to retrieve book: ${error.message}`
      );
    });
}

async function getBooksByAuthorUsingAxios(author) {
  try {
    const response = await axios.get(
      `${BASE_URL}/author/${encodeURIComponent(author)}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      `Unable to retrieve author books: ${error.message}`
    );
  }
}

async function getBooksByTitleUsingAxios(title) {
  try {
    const response = await axios.get(
      `${BASE_URL}/title/${encodeURIComponent(title)}`
    );

    return response.data;
  } catch (error) {
    throw new Error(
      `Unable to retrieve title books: ${error.message}`
    );
  }
}

module.exports.general = publicUsers;
module.exports.getAllBooksUsingAxios =
  getAllBooksUsingAxios;
module.exports.getBookByISBNUsingAxios =
  getBookByISBNUsingAxios;
module.exports.getBooksByAuthorUsingAxios =
  getBooksByAuthorUsingAxios;
module.exports.getBooksByTitleUsingAxios =
  getBooksByTitleUsingAxios;
