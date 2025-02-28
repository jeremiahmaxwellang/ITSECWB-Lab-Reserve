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
// FEB 28 EDIT: Changed the connection string (copied from ccapdev sample activity)
mongoose.connect('mongodb://127.0.0.1:27017/labyrinthDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// mongoose.connect('mongodb://localhost/labyrinthDB')

/* Initialize User path */
const User = require("./database/models/User")
const Seat = require("./database/models/Seat")
const Building = require("./database/models/Building.js")
const Room = require("./database/models/Room")
const Reservation = require("./database/models/Reservation")
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
    password: "9478bb58c888759b01f502aec75dabd4ea5ba64b45442127ca337ceb280f4f57", // actual admin password: "adminpassword1234"
    account_type: "Lab Technician",
}

var student1 = {
    user_id: 1220123,
    last_name: "Ang",
    first_name: "Jeremiah",
    email: "jeremiah_ang@dlsu.edu.ph", 
    password: "68eaeeaef51a40035b5d3705c4e0ffd68036b6b821361765145f410b0f996e11", // actual student password: "studentpassword"
    account_type: "Student",
}

//hard coded of building values
async function insertBuildings() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/labyrinthDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Define buildings
        const buildings = [
            { building_id: 1, building_name: "Science Hall" },
            { building_id: 2, building_name: "Engineering Complex" },
            { building_id: 3, building_name: "Library" }
        ];

        // Insert buildings if they don't exist
        for (const building of buildings) {
            await Building.findOneAndUpdate(
                { building_id: building.building_id }, // Search condition
                building, // Data to insert/update
                { upsert: true, new: true, setDefaultsOnInsert: true } // Upsert options
            );
        }

        console.log("✅ Buildings inserted (if not duplicates)");
        mongoose.connection.close();
    } catch (err) {
        console.error("⚠️ Error inserting buildings:", err);
    }
}

// Run the function
insertBuildings();



async function insertRooms() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/labyrinthDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Define rooms
        const rooms = [
            { building_id: 1, room_num: "101", floor_num: 1 },
            { building_id: 1, room_num: "102", floor_num: 1 },
            { building_id: 2, room_num: "201", floor_num: 2 }
        ];

        // Insert rooms if they don't exist
        for (const room of rooms) {
            await Room.findOneAndUpdate(
                { building_id: room.building_id, room_num: room.room_num }, // Search condition
                room, // Data to insert/update
                { upsert: true, new: true, setDefaultsOnInsert: true } // Upsert options
            );
        }

        console.log("✅ Rooms inserted (if not duplicates)");
        mongoose.connection.close();
    } catch (err) {
        console.error("⚠️ Error inserting rooms:", err);
    }
}

// Run the function
insertRooms();


async function insertSeats() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/labyrinthDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Define seats
        const seats = [
            { room_num: "101", seat_num: 1 },
            { room_num: "101", seat_num: 2 },
            { room_num: "102", seat_num: 1 }
        ];

        // Insert seats if they don't exist
        for (const seat of seats) {
            await Seat.findOneAndUpdate(
                { room_num: seat.room_num, seat_num: seat.seat_num }, // Search condition (unique key)
                seat, // Data to insert/update
                { upsert: true, new: true, setDefaultsOnInsert: true } // Upsert options
            );
        }

        console.log("✅ Seats inserted (if not duplicates)");
        mongoose.connection.close();
    } catch (err) {
        console.error("⚠️ Error inserting seats:", err);
    }
}

// Run the function
insertSeats();


async function insertReservations() {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://127.0.0.1:27017/labyrinthDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log("Connected to MongoDB");

        // Define reservations
        const reservations = [
            {
                user_id: 1220123,
                request_date: new Date("2025-03-01T10:00:00Z"),
                reserved_date: new Date("2025-03-02T14:00:00Z"),
                room_num: "101",
                seat_num: 1,
                anonymous: "N",
                reserved_for_id: null
            },
            {
                user_id: 1220456,
                request_date: new Date("2025-03-05T11:30:00Z"),
                reserved_date: new Date("2025-03-06T09:00:00Z"),
                room_num: "102",
                seat_num: 1,
                anonymous: "Y",
                reserved_for_id: 1220123 // Reserved for student1
            }
        ];

        // Insert reservations if they don't exist
        for (const reservation of reservations) {
            await Reservation.findOneAndUpdate(
                {
                    user_id: reservation.user_id,
                    room_num: reservation.room_num,
                    seat_num: reservation.seat_num,
                    reserved_date: reservation.reserved_date
                }, // Search condition to avoid duplicate reservations
                reservation, // Data to insert/update
                { upsert: true, new: true, setDefaultsOnInsert: true } // Upsert options
            );
        }

        console.log("✅ Reservations inserted (if not duplicates)");
        mongoose.connection.close();
    } catch (err) {
        console.error("⚠️ Error inserting reservations:", err);
    }
}

// Run the function
insertReservations();

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
app.get('/reserve', isAuthenticated, async(req,res) => {

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
        res.redirect('/')
    })
})

// Server listens on port 3000
var server = app.listen(3000, function(){

            // TEST DB QUERY, PLEASE COMMENT OUT WHEN YOU SEE THE TEST ACCOUNT IN MONGODBCOMPASS
            // User.create({
            //     user_id: 1230124,
            //     last_name: "second test",
            //     first_name: "test 2",
            //     email: "test2@dlsu.edu.ph", 
            //     password: "68eaeeaef51a40035b5d3705c4e0ffd68036b6b821361765145f410b0f996e11",
            //     account_type: "Student",
            // });



    console.log("Labyrinth Node Server is listening on port 3000...")
})