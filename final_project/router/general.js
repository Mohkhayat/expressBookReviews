const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


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
public_users.get('/', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:5000/books'); // Simulating an external API call
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    try {
        const { isbn } = req.params;
        const response = await axios.get(`http://localhost:5000/books/${isbn}`); // Simulating an API call
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "Book not found" });
    }
});

  
// Get book details based on author
public_users.get('/author/:author', async (req, res) => {
    try {
        const { author } = req.params;
        const response = await axios.get(`http://localhost:5000/books?author=${author}`); // Simulating API call
        return res.status(200).json(response.data);
    } catch (error) {
        return res.status(404).json({ message: "No books found by this author" });
    }
});


// Get all books based on title
public_users.get('/title/:title', async (req, res) => {
    try {
        const { title } = req.params;
        const response = await axios.get(`http://localhost:5000/books?title=${title}`); // Simulating API call
        return res.status(200).json(response.data);
    } catch (error) {
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
