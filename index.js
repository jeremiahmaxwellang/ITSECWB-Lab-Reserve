// Commands for installing NodeJS Packages
// npm init -y
// npm install express hbs path express-fileupload mongoose

const express = require('express');
const hbs = require('hbs');   //Handlebar variable
const path = require('path'); //Path variable
const fileUpload = require('express-fileupload')

// Mongoose Library
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/labyrinthDB')

const app = express();

app.set('view engine', 'hbs');

app.use(express.json()) // use json
app.use(express.urlencoded( {extended: true})); // files consist of more than strings
app.use(express.static('assets')) // static directory named "assets"

// TODO: Hardcode lab technician accounts
var user = {
    firstName: "",
    lastName: ""
};

var bodyParser = require('body-parser');
app.use( bodyParser.urlencoded({extended: false}) );

// Route to INDEX.HTML
// DONE: css is visible now when entering localhost:3000/ (accomplished with express.static('assets'))
app.get('/', function(req,res){
    res.sendFile(__dirname + '\\' + 'index.html');
});





// Server listens on port 3000
var server = app.listen(3000, function(){
    console.log("Labyrinth Node Server is listening on port 3000...");
});