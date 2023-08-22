const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
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
    const {username, password} = req.body;
    console.log('User Name', username);

    if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
    }
    if (authenticatedUser(username,password)) {
      let accessToken = jwt.sign({
        data: password
      }, 'access', { expiresIn: 60 * 60 });
  
      req.session.authorization = {
        accessToken,username
    }
    return res.status(200).send("Log In Successful");
    } else {
      return res.status(208).json({message: "Invalid Credentials. Check username and password"});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const  review  = req.query.review;
  const isbn = req.params.isbn
  if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;

            if (books[isbn]) {
              if (!books[isbn].reviews) {
                books[isbn].reviews = {};
              }
          
              // Modify existing review if posted by the same user
              if (books[isbn].reviews[username]) {
                books[isbn].reviews[username] = review;
              } else {
                // Add a new review for a different user
                books[isbn].reviews[username] = review;
              }
          
              res.status(200).send('Review posted successfully.');
            } else {
              res.status(404).send('Book not found.');
            }

            next();
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});

// Route for deleting user's reviews
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const  isbn  = req.params.isbn;

  if(req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access",(err,user)=>{
        if(!err){
            req.user = user;
            if (books[isbn]) {
              if (books[isbn].reviews && books[isbn].reviews[req.user]) {
                delete books[isbn].reviews[req.user];
                res.status(200).send('Review deleted successfully.');
              } else {
                res.status(404).send('Review not found.');
              }
            } else {
              res.status(404).send('Book not found.');
            }


            next();
        }
        else{
            return res.status(403).json({message: "User not authenticated"})
        }
     });
 } else {
     return res.status(403).json({message: "User not logged in"})
 }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
