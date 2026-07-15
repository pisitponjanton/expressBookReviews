const express = require("express");
const axios = require("axios");
const books = require("./booksdb.js");
const {
  isValid,
  users,
} = require("./auth_users.js");

const publicUsers = express.Router();
const BASE_URL = "http://localhost:5000";

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

publicUsers.get("/", async (req, res) => {
  try {
    const result = await Promise.resolve(books);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

publicUsers.get("/isbn/:isbn", async (req, res) => {
  try {
    const book = await Promise.resolve(
      books[req.params.isbn]
    );

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

publicUsers.get("/author/:author", async (req, res) => {
  try {
    const searchAuthor =
      req.params.author.toLowerCase();

    const result = await Promise.resolve(
      Object.fromEntries(
        Object.entries(books).filter(([, book]) =>
          book.author
            .toLowerCase()
            .includes(searchAuthor)
        )
      )
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

publicUsers.get("/title/:title", async (req, res) => {
  try {
    const searchTitle =
      req.params.title.toLowerCase();

    const result = await Promise.resolve(
      Object.fromEntries(
        Object.entries(books).filter(([, book]) =>
          book.title
            .toLowerCase()
            .includes(searchTitle)
        )
      )
    );

    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
});

publicUsers.get("/review/:isbn", async (req, res) => {
  try {
    const book = await Promise.resolve(
      books[req.params.isbn]
    );

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
 * Axios implementations for Tasks 11–14.
 * Run these functions after the server has started.
 */

async function getAllBooksUsingAxios() {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
}

function getBookByISBNUsingAxios(isbn) {
  return axios
    .get(`${BASE_URL}/isbn/${encodeURIComponent(isbn)}`)
    .then((response) => response.data);
}

async function getBooksByAuthorUsingAxios(author) {
  const response = await axios.get(
    `${BASE_URL}/author/${encodeURIComponent(author)}`
  );

  return response.data;
}

async function getBooksByTitleUsingAxios(title) {
  const response = await axios.get(
    `${BASE_URL}/title/${encodeURIComponent(title)}`
  );

  return response.data;
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
