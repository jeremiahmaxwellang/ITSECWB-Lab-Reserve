// Commands for installing NodeJS Packages
// npm init -y
// npm install express hbs path express-fileupload express-session mongoose

const express = require('express')
const hbs = require('hbs') 

const fileUpload = require('express-fileupload')
const session = require('express-session') //please download this new library
const mongoose = require('mongoose')
const crypto = require('crypto') //no need to install crypto, it's built-in already

// DB CONNECTION
mongoose.connect('mongodb://localhost/labyrinthDB')

/* Initialize User path */
const User = require("./database/models/User")
const path = require('path')


const app = express()

app.set('view engine', 'hbs')

app.use(express.json()) // use json
app.use(express.urlencoded( {extended: true})) // files consist of more than strings
app.use(express.static('assets')) // static directory for "assets" folder
app.use(express.static('uploads')) // static directory for "uploads" folder


// SESSION
// TODO: Remember me for 3 weeks
app.use(session({
    secret: 'some secret',
    cookie: { maxAge: 30000 },
    resave: false,
    saveUninitialized: false

}))

// app.use(cookieParser())

const isAuthenticated = (req, res, next) => {
    if(req.session.user)
        next()

    else res.redirect("/login")
}

// TODO: Hardcode lab technician accounts
// MCO3 TODO: Hash the password
var admin1 = {
    user_id: 1181234,
    last_name: "Eladio",
    first_name: "Don",
    email: "don_eladio@dlsu.edu.ph",
    password: "9478bb58c888759b01f502aec75dabd4ea5ba64b45442127ca337ceb280f4f57", 
    account_type: "Lab Technician",
}




// actual admin password: "adminpassword1234"

var student1 = {
    user_id: 1220123,
    last_name: "Ang",
    first_name: "Jeremiah",
    email: "jeremiah_ang@dlsu.edu.ph", 
    password: "68eaeeaef51a40035b5d3705c4e0ffd68036b6b821361765145f410b0f996e11",
    account_type: "Student",
}

// actual student password: "studentpassword"

/*
    SHA256 hash generation
    Reference: https://www.techiedelight.com/generate-sha-256-hash-javascript/
*/
function sha256(password) {
    // Create a hash object
    const hash = crypto.createHash('sha256');
 
    // Pass the input data to the hash object
    hash.update(password);
 
    // Get the output in hexadecimal format
    return hash.digest('hex');
}

var bodyParser = require('body-parser')
app.use( bodyParser.urlencoded({extended: false}) )

// Route to INDEX.HTML
// localhost:3000/
app.get('/', function(req,res){
    // TEST DB QUERY, PLEASE UNCOMMENT WHEN YOU SEE THE TEST ACCOUNT IN MONGODBCOMPASS
    User.create({
        user_id: 1220123,
        last_name: "LAng",
        first_name: "test",
        email: "test@dlsu.edu.ph", 
        password: "68eaeeaef51a40035b5d3705c4e0ffd68036b6b821361765145f410b0f996e11",
        account_type: "Student",
    });

    res.sendFile(__dirname + '\\' + 'index.html')
})

// Route to register.html
// localhost:3000/register
app.get('/register', function(req,res){

    res.sendFile(__dirname + '\\' + 'register.html')
})

// app.post('/register', function(req, res) {

//         User.create({
//         ...req.body,

//         });

//         res.redirect('/');
        
// })


// Route to login.html
// localhost:3000/login
app.get('/login', function(req,res){
    if(req.session.user){
        res.redirect('/dashboard');
    }

    else{
        res.sendFile(__dirname + '/login.html')
    }
})

// SUBMIT LOGIN CREDENTIALS ROUTE
app.post("/login", express.urlencoded({extended: true}), (req,res) => {
    const{email, password} = req.body

    console.log("Email: ", email)
    console.log("Pass: ", sha256(password))

    // route for students
    // TODO: Change this so it checks the DB if email exists
    if(email === student1.email && sha256(password) === student1.password){
        console.log("signed in")
        req.session.user = student1
        res.cookie("sessionId",req.sessionID)

        res.redirect('/dashboard')
    }

    // route for admin
    else if(email === admin1.email && sha256(password) === admin1.password){
        req.session.user = admin1
        res.cookie("sessionId",req.sessionID)

        res.redirect("/labtech")
    }

    else{
        res.status(401).send("Invalid credentials. <a href='login>Please try again</a>")
    }
})

// TODO: Profile page must load the user's details from the DB - JER
// Route to profile handlebar (MUST DEPEND ON USER SESSION)
// isAuthenticated required to make sure there is a session
app.get('/profile', isAuthenticated, (req,res) => {
    const userData = req.session.user
    console.log(userData)

    res.render('profile', {userData})
})

// TODO: Top right Profile icon must be user's icon
// Route to labtech handlebar (MUST DEPEND ON USER SESSION)
app.get('/labtech', isAuthenticated, (req,res) => {
    const userData = req.session.user
    console.log(userData)

    res.render('labtech', {userData})
})


// Route to reservation handlebar (MUST DEPEND ON USER SESSION)
app.get('/reserve', async(req,res) => {

    res.render('reserve')
})

// Route to dashboard handlebar (MUST DEPEND ON USER SESSION)
app.get('/dashboard', async(req,res) => {

    res.render('dashboard')
})







// LOGOUT (destroy the session)
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err)
            return res.status(500).send("Error logging out")

        res.clearCookie('sessionId')
        res.redirect('/login')
    })
})

// Server listens on port 3000
var server = app.listen(3000, function(){
    console.log("Labyrinth Node Server is listening on port 3000...")
})