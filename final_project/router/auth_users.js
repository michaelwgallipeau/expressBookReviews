const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    //write code to check is the username is valid
    let userswithsamename = users.filter((user)=>{
        return user.username === username
    });

    if(userswithsamename.length > 0){
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username,password)=>{ //returns boolean
    //write code to check if username and password match the one we have in records.
    let validusers = users.filter((user)=>{
        return (user.username === username && user.password === password)
    });

    if(validusers.length > 0){
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    //Write your code here
    // return res.status(501).json({message: "Yet to be implemented"});
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({message: "Error logging in"});
    }

    if (authenticatedUser(username,password)) {
        let accessToken = jwt.sign({
        data: password
        }, 'access', { expiresIn: 600 * 600 });

        req.session.authorization = {
        accessToken,username
        }
        req.session.username = username;
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({message: "Invalid Login. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    const username = req.session.username;

    let book = books[isbn];
    if (book) {
        let reviewText = req.body.reviewText;
        if (username && reviewText) {
            book.reviews[username] = reviewText;
            res.status(200).json({message: "Review added successfully"});
        } else {
            res.status(400).json({message: "Username '" + username + "' and Review Content are required."});
        }
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    // return res.status(300).json({message: "Yet to be implemented"});
    const isbn = req.params.isbn;
    const username = req.session.username;

    let book = books[isbn];
    if (book) {
        if (username) {
            delete book.reviews[username];
            res.status(200).json({message: "Review deleted successfully"});
        } else {
            res.status(400).json({message: "Review was not found for username."});
        }
    } else {
        res.status(404).json({message: "Book not found"});
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
