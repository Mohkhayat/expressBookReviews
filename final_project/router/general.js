const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const { username, password } = req.body; // Extract username and password from request body

    // Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "User already exists!" });
    }

    // Register the new user
    users.push({ username, password });
    return res.status(201).json({ message: "User successfully registered. Now you can login" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Books converted to json
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]); // Return book details if found
    } else {
        return res.status(404).json({ message: "Book not found" }); // Handle invalid ISBN
    }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    let booksByAuthor = [];
    // Iterate over all books to find matches
    for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor.push(books[key]); // Add matching books to array
        }
    }
    // Return result if books are found, otherwise return an error
    if (booksByAuthor.length > 0) {
        return res.status(200).json(booksByAuthor);
    } else {
        return res.status(404).json({ message: "No books found by this author" });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    let booksByTitle = [];
    // Iterate over all books to find matches
    for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
            booksByTitle.push(books[key]); // Add matching books to array
        }
    }
    // Return result if books are found, otherwise return an error
    if (booksByTitle.length > 0) {
        return res.status(200).json(booksByTitle);
    } else {
        return res.status(404).json({ message: "No books found with this title" });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn; // Extract ISBN from request parameters
    
    if (books[isbn]) {
        return res.status(200).json(books[isbn].reviews); // Return book reviews if found
    } else {
        return res.status(404).json({ message: "Book not found" }); // Handle invalid ISBN
    }
});

module.exports.general = public_users;
