// Commands for installing NodeJS Packages
// npm init -y
// npm install express hbs path express-fileupload express-session mongoose

const express = require('express');
const hbs = require('hbs'); 
const path = require('path');
const fileUpload = require('express-fileupload')
const session = require('express-session') //please download this new library

// Mongoose Library
const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/labyrinthDB')

const app = express();

app.set('view engine', 'hbs');

app.use(express.json()) // use json
app.use(express.urlencoded( {extended: true})); // files consist of more than strings
app.use(express.static('assets')) // static directory for "assets" folder
app.use(express.static('uploads')) // static directory for "uploads" folder


// SESSION
// TODO: Cookie expires after how long? (maxAge = ?)
app.use(session({
    secret: 'some secret',
    cookie: { maxAge: 30000 },
    saveUninitialized: false

}));

// TODO: Hardcode lab technician accounts
// MCO3 TODO: Hash the password
var admin1 = {
    user_id: 1181234,
    last_name: "Eladio",
    first_name: "Don",
    email: "don_eladio@dlsu.edu.ph",
    password: "123456789012345", 
    account_type: "Lab Technician",
}

var student1 = {
    user_id: 1220123,
    last_name: "Ang",
    first_name: "Jeremiah",
    email: "jeremiah_ang@dlsu.edu.ph",
    password: "123456789012345", 
    account_type: "Student",
}

var bodyParser = require('body-parser');
app.use( bodyParser.urlencoded({extended: false}) );

// Route to INDEX.HTML
// localhost:3000/
app.get('/', function(req,res){
    res.sendFile(__dirname + '\\' + 'index.html');
});

// Route to register.html
// localhost:3000/register
app.get('/register', function(req,res){
    res.sendFile(__dirname + '\\' + 'register.html');
});

// Route to login.html
// localhost:3000/login
app.get('/login', function(req,res){
    const { user_id, password } = req.body;

    // MCO3 TODO: check if the hashed password matches the one stored in the DB
    if(user_id && password) {

    }
    res.sendFile(__dirname + '\\' + 'login.html');
});

// Route to reservation handlebar (MUST DEPEND ON USER SESSION)
app.get('/reserve', async(req,res) => {

    res.render('reserve')
})

// Route to dashboard handlebar (MUST DEPEND ON USER SESSION)
app.get('/dashboard', async(req,res) => {

    res.render('dashboard')
})

// TODO: Top right Profile icon must be user's icon
// Route to labtech handlebar (MUST DEPEND ON USER SESSION)
app.get('/labtech', async(req,res) => {

    res.render('labtech')
})


// TODO: Profile page must load the user's details from the DB - JER
// Route to profile handlebar (MUST DEPEND ON USER SESSION)
app.get('/profile', async(req,res) => {
    res.render('profile')
    // res.render('profile',{user})
})


// Server listens on port 3000
var server = app.listen(3000, function(){
    console.log("Labyrinth Node Server is listening on port 3000...");
});