const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  console.log('USer name', username);
  console.log('Password', password);

  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }
  
  if (username && password) {
    if (!doesExist(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }


  return res.status(300).json({message: "Please provide Username and Password"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  const booksData = JSON.stringify(books);
  console.log('Books Data', booksData);
  return res.status(300).json({message: "Books Data", data: books});
});

// Get the book list available in the shop using promise
public_users.get('/getallbooks',function (req, res) {
  const promiseCall = new Promise((resolve, reject) => {
    try{
      const booksData = JSON.stringify(books);
      console.log('Books Data', booksData);
      resolve(booksData)
      // return res.status(300).json({message: "Books Data", data: booksData});

    } catch(err){
      reject(err)
      // return res.status(401).json({messgae: "Error while retriving file", data: err});

    }
  });
  console.log(promiseCall);
  
  promiseCall.then(
    (booksData) => {return res.status(300).json({message: "Books Data", data: booksData});},
    (err) => { return res.status(401).json({messgae: "Error while retriving Book", data: err});}
  );


});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  console.log('ISBN Data', isbn);

  let newBookDetails = [] ;

  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const book = books[key];
      if (key === isbn) {
        newBookDetails.push(book);
      }
    }
  }

  // console.log('New Filtered Data', newBookDetails);
  return res.status(300).json({message: "Found Books by Author", data: newBookDetails});
 });

 // Get the book details based on ISBN using Promise
public_users.get('/getbyisbn/:isbn',function (req, res) {
  const isbn = req.params.ISBN;

  const promiseCall = new Promise((resolve, reject) => {
    try{
      let filtered_books = books.filter((book) => book.ISBN === isbn);
      console.log('Books Data by ISBN', filtered_books);
      resolve(filtered_books);

    } catch(err){
      reject(err);
    }
  });
  console.log(promiseCall);
  
  promiseCall.then(
    (filtered_books) => {return res.status(300).json({message: "Books Data by ISBN", data: filtered_books});},
    (err) => { return res.status(401).json({messgae: "Error while retriving Book", data: err});}
  );

});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
  let newBookDetails = [] ;

  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const book = books[key];
      if (book.author === author) {
        newBookDetails.push(book);
      }
    }
  }

  // console.log('New Filtered Data', newBookDetails);
  return res.status(300).json({message: "Found Books by Author", data: newBookDetails});
});
// Get the book details based on ISBN using Promise
public_users.get('/getbyauthor/:author',function (req, res) {
  const author = req.params.author;
  let newBookDetails = [] ;

  const promiseCall = new Promise((resolve, reject) => {
    try{
      for (const key in books) {
        if (books.hasOwnProperty(key)) {
          const book = books[key];
          if (book.author === author) {
            newBookDetails.push(book);
          }
        }
      }
      console.log(newBookDetails)
      resolve(newBookDetails);

    } catch(err){
      reject(err);
    }
  });
  console.log(promiseCall);
  
  promiseCall.then(
    (newBookDetails) => {return res.status(300).json({message: "Books Data by Author", data: newBookDetails});},
    (err) => { return res.status(401).json({messgae: "Error while retriving Book", data: err});}
  );

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {

  const title = req.params.title;
  let newBookDetails = [] ;

  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const book = books[key];
      if (book.title === title) {
        newBookDetails.push(book);
      }
    }
  }

  // console.log('New Filtered Data', newBookDetails);
  return res.status(300).json({message: "Found Books by Title", data: newBookDetails});
});

// Get all books based on title using Promise
public_users.get('/getbytitle/:title',function (req, res) {
  const title = req.params.title;
  let newBookDetails = [] ;

  const promiseCall = new Promise((resolve, reject) => {
    try{
      for (const key in books) {
        if (books.hasOwnProperty(key)) {
          const book = books[key];
          if (book.title === title) {
            newBookDetails.push(book);
          }
        }
      }
      console.log(newBookDetails)
      resolve(newBookDetails);

    } catch(err){
      reject(err);
    }
  });
  console.log(promiseCall);
  
  promiseCall.then(
    (newBookDetails) => {return res.status(300).json({message: "Books Data by title", data: newBookDetails});},
    (err) => { return res.status(401).json({messgae: "Error while retriving Book", data: err});}
  );

});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.ISBN;
  let bookReviews = [];

  for (const key in books) {
    if (books.hasOwnProperty(key)) {
      const book = books[key];
      if (book.ISBN === isbn) {
        bookReviews.push(book.review);
      }
    }
  }


  return res.status(300).json({message: "Book REview by ISBN", data: bookReviews});
});

module.exports.general = public_users;
