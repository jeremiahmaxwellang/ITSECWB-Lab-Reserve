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
    user_id: new mongoose.Types.ObjectId(), // Generate ObjectId for user_id
    last_name: "Eladio",
    first_name: "Don",
    email: "don_eladio@dlsu.edu.ph",
    password: "9478bb58c888759b01f502aec75dabd4ea5ba64b45442127ca337ceb280f4f57", // actual admin password: "adminpassword1234"
    account_type: "Lab Technician",
}

var student1 = {
    user_id: new mongoose.Types.ObjectId(), // Generate ObjectId for user_id
    last_name: "Ang",
    first_name: "Jeremiah",
    email: "jeremiah_ang@dlsu.edu.ph",
    password: "68eaeeaef51a40035b5d3705c4e0ffd68036b6b821361765145f410b0f996e11", // actual student password: "studentpassword"
    account_type: "Student",
};

// Function to Insert Hardcoded Users
async function insertUsers() {
    try {
        await User.findOneAndUpdate({ email: admin1.email }, admin1, { upsert: true, new: true });
        await User.findOneAndUpdate({ email: student1.email }, student1, { upsert: true, new: true });
        console.log("✅ Users inserted or updated");
    } catch (err) {
        console.error("⚠️ Error inserting users:", err);
    }
}

//hard coded of building values
async function insertBuildings() {
    try {
        // Define building data
        const buildings = [
            { building_id: 1, building_name: "Science Hall" },
            { building_id: 2, building_name: "Engineering Complex" },
            { building_id: 3, building_name: "Library" }
        ];

        for (const building of buildings) {
            const existingBuilding = await Building.findOne({ building_id: building.building_id });

            if (!existingBuilding) {
                // Explicitly create the document using `new Building()` before saving
                const newBuilding = new Building(building);
                await newBuilding.save();
                console.log(`✅ Building '${building.building_name}' (ID: ${building.building_id}) added.`);
            } else {
                console.warn(`⚠️ Building '${building.building_name}' already exists. Skipping...`);
            }
        }

        console.log("✅ Building insertion process completed.");
    } catch (err) {
        console.error("⚠️ Error inserting buildings:", err);
    }
}

//hardcoded room values
async function insertRooms() {
    try {
        // Validate that buildings exist before adding rooms
        const existingBuildings = await Building.find();
        if (existingBuildings.length === 0) {
            console.error("⚠️ No buildings found. Cannot insert rooms.");
            return;
        }

        // Define rooms with foreign key `building_id`
        const rooms = [
            { building_id: 1, room_num: "101", floor_num: 1 },
            { building_id: 1, room_num: "102", floor_num: 1 },
            { building_id: 2, room_num: "201", floor_num: 2 },
            { building_id: 2, room_num: "202", floor_num: 2 },
            { building_id: 3, room_num: "301", floor_num: 3 }
        ];

        for (const room of rooms) {
            // Check if the referenced building exists
            const buildingExists = existingBuildings.some(b => b.building_id === room.building_id);

            if (!buildingExists) {
                console.warn(`⚠️ Skipping Room ${room.room_num}: Building ID ${room.building_id} not found.`);
                continue;
            }

            // Check if the room already exists before inserting
            const existingRoom = await Room.findOne({ room_num: room.room_num });

            if (!existingRoom) {
                await Room.create(room);
                console.log(`✅ Room ${room.room_num} added in Building ID ${room.building_id}.`);
            } else {
                console.warn(`⚠️ Room ${room.room_num} already exists. Skipping...`);
            }
        }

        console.log("✅ Room insertion process completed.");
    } catch (err) {
        console.error("⚠️ Error inserting rooms:", err);
    }
}

//hardcoded seat values
async function insertSeats() {
    try {
        // Define seats (Updated hardcoded values)
        const seats = [
            { room_num: "101", seat_num: 1 },
            { room_num: "102", seat_num: 1 },
            { room_num: "103", seat_num: 1 },        
            { room_num: "103", seat_num: 2 },
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
    } catch (err) {
        console.error("⚠️ Error inserting seats:", err);
    }
}

async function insertReservations() {
    try {
        // Fetch user IDs dynamically instead of hardcoding emails
        const student = await User.findOne({ email: "jeremiah_ang@dlsu.edu.ph" });
        const admin = await User.findOne({ email: "don_eladio@dlsu.edu.ph" });

        if (!student || !admin) {
            console.error("⚠️ Error: User(s) not found. Cannot create reservations.");
            return;
        }

        // Define hardcoded reservations
        const reservations = [
            {
                user_id: admin.user_id,
                request_date: new Date("2025-03-01T10:00:00Z"),
                reserved_date: new Date("2025-03-02T14:00:00Z"),
                room_num: "101",
                seat_num: 1,
                anonymous: "N",
                reserved_for_id: null
            },
            {
                user_id: student.user_id,
                request_date: new Date("2025-03-05T11:30:00Z"),
                reserved_date: new Date("2025-03-06T09:00:00Z"),
                room_num: "102",
                seat_num: 1,
                anonymous: "Y",
                reserved_for_id: null
            }
        ];

        // Iterate and insert reservations only if the seat is available
        for (const reservation of reservations) {
            const existingReservation = await Reservation.findOne({
                room_num: reservation.room_num,
                seat_num: reservation.seat_num,
                reserved_date: reservation.reserved_date
            });

            if (!existingReservation) {
                await Reservation.create(reservation);
                console.log(`✅ Reservation added for Room ${reservation.room_num}, Seat ${reservation.seat_num}`);
            } else {
                console.warn(`⚠️ Seat ${reservation.seat_num} in Room ${reservation.room_num} is already reserved.`);
            }
        }

        console.log("✅ Reservation process completed.");
    } catch (err) {
        console.error("⚠️ Error inserting reservations:", err);
    }
}

// Run all insert functions sequentially
async function runInserts() {
    await insertUsers();
    await insertReservations(student1.user_id, admin1.user_id);
    await insertBuildings();
    await insertRooms();
    await insertSeats();
}
runInserts();

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