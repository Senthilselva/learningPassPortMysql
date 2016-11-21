
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var passport = require("passport");
var Strategy = require("passport-facebook").Strategy;
var path = require("path");



var app = express();


app.use(express.static(process.cwd() + '/public'));

app.use(bodyParser.urlencoded({
	extended: false
}));
// override with POST having ?_method=DELETE
app.use(methodOverride('_method'));

// we bring in the models we exported with index.js
var models = require("./models");


passport.use(new Strategy({
  clientID: process.env.CLIENT_ID || "1826103597601691",
  clientSecret: process.env.CLIENT_SECRET || "1c5d8736244d4ecadc89fe7c0384eff0",
  callbackURL: "http://localhost:3000/login/facebook/return"
},
  function(accessToken, refreshToken, profile, cb) {
    // In this example, the user"s Facebook profile is supplied as the user
    // record.  In a production-quality application, the Facebook profile should
    // be associated with a user record in the application"s database, which
    // allows for account linking and authentication with other identity
    // providers.

    console.log("PPPPPRRRRROOOOFFFFIIIILLLLEEEEE"+ profile);
    return cb(null, profile);
}));


// Configure Passport authenticated session persistence.
//
// In order to restore authentication state across HTTP requests, Passport needs
// to serialize users into and deserialize users out of the session.  In a
// production-quality application, this would typically be as simple as
// supplying the user ID when serializing, and querying the user record by ID
// from the database when deserializing.  However, due to the fact that this
// example does not have a database, the complete Facebook profile is serialized
// and deserialized.
//
// If the above doesn"t make sense... don"t worry. I just copied and pasted too.
passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


// Incorporated a variety of Express packages.
app.use(require("morgan")("combined"));
app.use(require("cookie-parser")());
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(require("express-session")({ 
			secret: "keyboard cat",
			resave: true,
			saveUninitialized: true }));


//for passport
// Here we start our Passport process and initiate the storage of sessions (i.e. closing browser maintains user)
app.use(passport.initialize());
app.use(passport.session());

var routes = require('./users_controller.js')(passport,app);
//app.use('/', routes);

console.log("HAHAHAHAH")


// we set the port of the app
app.set('port', process.env.PORT || 3000);

// we sync the models with our db 
// (thus creating the apropos tables)
models.sequelize.sync().then(function () {
	// set our app to listen to the port we set above
  var server = app.listen(app.get('port'), function() {
  	// then save a log of the listening to our debugger.
    console.log('Express server listening on port ' + server.address().port);
  });
});