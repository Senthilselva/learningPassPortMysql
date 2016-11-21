// Routes
// =============================================================

var express = require('express');
var router = express.Router();
var models = require('./models');
var path = require('path');


module.exports = function(passport, app){
console.log("user")

// View the Main Page
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

// // View the Login Page
// app.get("/login", function(req, res) {
//   res.sendFile(path.join(__dirname, "login.html"));
// });

// Initiate the Facebook Authentication
app.get("/login/facebook", passport.authenticate("facebook"),function(req,res){
  console.log("auth done")
});

// When Facebook is done, it uses the below route to determine where to go
app.get("/login/facebook/return",
  passport.authenticate("facebook", { failureRedirect: "/login" }),

  function(req, res) {
    res.redirect("/inbox");
  });

// This page is available for viewing a hello message
app.get("/inbox",
  require("connect-ensure-login").ensureLoggedIn(),
  function(req, res) {

    res.sendFile(path.join(__dirname, "inbox.html"));

  });

// This route is available for retrieving the information associated with the authentication method
app.get("/api/inbox",
  require("connect-ensure-login").ensureLoggedIn(),
  function(req, res) {

    var queryString = "SELECT * FROM table_of_users WHERE user_id=" + req.user.id;
    connection.query(queryString, function(err, data) {

      if(err) throw err

      if (data.length == 0) { 

        console.log("HEY");

      }
      res.json(data);

    });

  });
console.log("user2")
}