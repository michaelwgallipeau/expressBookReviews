const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

function getBook(isbn) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books[isbn]); 
        }, 100); 
        
    });
}

function getBooks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(books);
        }, 100); 
        
    });
}

function getBooksByAuthor(author) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {

            let matchingBooks = [];

            // Iterate through object keys
            Object.keys(books).forEach(key => {
                let book = books[key];
                if (book.author.toLowerCase() === author.toLowerCase()) {
                    matchingBooks.push(book);
                }
            });
        
            if (matchingBooks.length > 0) {
                resolve(matchingBooks);
            } else {
                reject(Error('No books found for the specified author.'));
            }             
        }, 100); 
        
    });
}

public_users.post("/register", (req,res) => {
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
public_users.get('/',async function (req, res) {
    try {
        const books = await getBooks();
        res.send(JSON.stringify(books, null, 4));
    } catch (error) {
        res.status(500).json({message: "Failed to retrieve book list", error: error.message});
    }
});

// TEST Get the book list available in the shop
public_users.get('/users',function (req, res) {
    res.send(JSON.stringify(users,null,4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async function (req, res) {
    try {
        const book = await getBook(req.params.isbn);
        res.send(JSON.stringify(book, null, 4));
    } catch (error) {
        res.status(500).json({message: "Failed to retrieve book list", error: error.message});
    }
});

// Get book details based on author
public_users.get('/author/:author',async function (req, res) {
    try {
        const books = await getBooksByAuthor(req.params.author);
            res.send(JSON.stringify(books, null, 4));
    } catch (error) {
        res.status(500).json({message: "Failed to retrieve book list", error: error.message});
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
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
    const isbn = req.params.isbn;
    let book = books[isbn];
    if (book) {
        res.send(book.reviews);
    } else {
        res.status(404).send('Book not found');
    }
});

module.exports.general = public_users;
