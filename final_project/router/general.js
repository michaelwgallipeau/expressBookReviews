const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!isValid(username)) { 
        // if (!authenticatedUser(username, password)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User " + username + " successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User " + username + " already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    res.send(JSON.stringify(books,null,4));
});

// TEST Get the book list available in the shop
public_users.get('/users',function (req, res) {
    //Write your code here
    //return res.status(300).json({message: "Yet to be implemented"});
    res.send(JSON.stringify(users,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    res.send(books[isbn]);
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    const author = req.params.author;
    let matchingBooks = [];

    // Iterate through object keys
    Object.keys(books).forEach(key => {
        let book = books[key];
        if (book.author === author) {
            matchingBooks.push(book);
        }
    });

    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).send('No books found for the specified author.');
    }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    const title = req.params.title;
    let matchingBooks = [];

    // Iterate through object keys
    Object.keys(books).forEach(key => {
        let book = books[key];
        if (book.title.toLowerCase() === title.toLowerCase()) {
            matchingBooks.push(book);
        }
    });

    if (matchingBooks.length > 0) {
        res.json(matchingBooks);
    } else {
        res.status(404).send('No books found for the specified title.');
    }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        res.send(book.reviews);
    } else {
        res.status(404).send('Book not found');
    }
});

module.exports.general = public_users;
