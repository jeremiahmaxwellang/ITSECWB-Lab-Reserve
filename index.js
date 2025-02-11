// How to run the NodeJS Server:
//  1. Make sure you installed NodeJS

//  2. On the command prompt, change directory to this project folder

//  3. To install Express package, enter:
//  npm install express

//  4. To install Handlebar package, enter:
//  npm install hbs

//  5. To run the server, enter the command "node <filename>.js"
//     node index.js

//  6. On your browser, go to localhost:3000/
//     You will see the server responds with a message

//  7. To close the server on the command prompt, do CTRL+C


var express = require('express');
var hbs = require('hbs');   //Handlebar variable
var path = require('path'); //Path variable


var app = express();

app.set('view engine', 'hbs');

// TODO: Add all user details variables
// User Details
var user = {
    firstName: "",
    lastName: ""
};

var bodyParser = require('body-parser');
app.use( bodyParser.urlencoded({extended: false}) );

// Route to INDEX.HTML
// TODO: css should be visible when entering localhost:3000/
app.get('/', function(req,res){
    res.sendFile(__dirname + '\\' + 'index.html');
});





// Server listens on port 3000
var server = app.listen(3000, function(){
    console.log("Labyrinth Node Server is listening on port 3000...");
});