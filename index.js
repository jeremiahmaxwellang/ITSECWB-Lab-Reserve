const express = require('express')
const hbs = require('hbs') 

const fileUpload = require('express-fileupload')
const session = require('express-session')
const mongoose = require('mongoose')
const crypto = require('crypto')
const cookieParser = require("cookie-parser")

// DB CONNECTION
mongoose.connect('mongodb://127.0.0.1:27017/labyrinthDB', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err))

/* Initialize User path */
const User = require("./database/models/User")
const Seat = require("./database/models/Seat")
const Building = require("./database/models/Building.js")
const Room = require("./database/models/Room")
const Reservation = require("./database/models/Reservation")
const path = require('path')


const app = express()

app.set('view engine', 'hbs')

app.use(express.json())
app.use(express.urlencoded( {extended: false})) // files consist of more than strings
app.use(express.static('assets')) 
app.use(express.static('uploads')) 


// SESSION
app.use(session({
    secret: 'some secret',

    // cookie expires in approx 3 weeks
    cookie: { maxAge: 1814400000 },

    resave: false,
    saveUninitialized: false

}))

app.use(cookieParser())

var bodyParser = require('body-parser')
app.use( bodyParser.urlencoded({extended: false}) )

const isAuthenticated = (req, res, next) => {
    if(req.session.user)
        next()

    else res.redirect("/login")
}


// Autocreated Accounts
var admin1 = {
    last_name: "Carunongan",
    first_name: "Arturo",
    email: "art@dlsu.edu.ph",
    password: "9478bb58c888759b01f502aec75dabd4ea5ba64b45442127ca337ceb280f4f57", // actual admin password: "adminpassword1234"
    account_type: "Lab Technician",
    profile_picture: "profile_pics/default_avatar.jpg",
}

var admin2 = {
    last_name: "Fazbear",
    first_name: "John",
    email: "john_fazbear@dlsu.edu.ph",
    password: "4b8f353889d9a05d17946e26d014efe99407cba8bd9d0102d4aab10ce6229043", // actual admin password: "password01"
    account_type: "Lab Technician",
    profile_picture: "profile_pics/default_avatar.jpg",
}

// Hardcoded Student Accounts
var student1 = {
    last_name: "Ang",
    first_name: "Jeremiah",
    email: "jeremiah_ang@dlsu.edu.ph",
    password: "68eaeeaef51a40035b5d3705c4e0ffd68036b6b821361765145f410b0f996e11", // actual student password: "studentpassword"
    account_type: "Student",
    profile_picture: "profile_pics/avatar.png",
}

var student2 = {
    last_name: "Duelas",
    first_name: "Charles Kevin",
    email: "charles_duelas@dlsu.edu.ph",
    password: "af0d81ce666749c1e154a461a8c4f1117010dc058a4b08a45987328730e19d20", // actual student password: "quackerson"
    account_type: "Student",
    profile_picture: "profile_pics/avatar.png",
}

var student3 = {
    last_name: "Woo",
    first_name: "Sung Jin",
    email: "sung_woo@dlsu.edu.ph",
    password: "ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f", // actual student password: "password123"
    account_type: "Student",
    profile_picture: "profile_pics/avatar.png",
}

// Function to Insert Hardcoded Users
async function insertUsers() {
    try {
        await User.findOneAndUpdate({ email: admin1.email }, admin1, { upsert: true, new: true })
        await User.findOneAndUpdate({ email: admin2.email }, admin2, { upsert: true, new: true })
        await User.findOneAndUpdate({ email: student1.email }, student1, { upsert: true, new: true })
        await User.findOneAndUpdate({ email: student2.email }, student2, { upsert: true, new: true })
        await User.findOneAndUpdate({ email: student3.email }, student3, { upsert: true, new: true })
        console.log("✅ Users inserted or updated")
    } catch (err) {
        console.error("⚠️ Error inserting users:", err)
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
        ]

        for (const building of buildings) {
            const existingBuilding = await Building.findOne({ building_id: building.building_id })

            if (!existingBuilding) {
                // Explicitly create the document using `new Building()` before saving
                const newBuilding = new Building(building)
                await newBuilding.save()
                console.log(`✅ Building '${building.building_name}' (ID: ${building.building_id}) added.`)
            } else {
                console.warn(`⚠️ Building '${building.building_name}' already exists. Skipping...`)
            }
        }

        console.log("✅ Building insertion process completed.")
    } catch (err) {
        console.error("⚠️ Error inserting buildings:", err)
    }
}

//hardcoded room values
async function insertRooms() {
    try {
        // Validate that buildings exist before adding rooms
        const existingBuildings = await Building.find()
        if (existingBuildings.length === 0) {
            console.error("⚠️ No buildings found. Cannot insert rooms.")
            return
        }

        // Define rooms with foreign key `building_id`
        const rooms = [
            { building_id: 1, room_num: "101", floor_num: 1 },
            { building_id: 1, room_num: "102", floor_num: 1 },
            { building_id: 2, room_num: "201", floor_num: 2 },
            { building_id: 2, room_num: "202", floor_num: 2 },
            { building_id: 3, room_num: "301", floor_num: 3 }
        ]

        for (const room of rooms) {
            // Check if the referenced building exists
            const buildingExists = existingBuildings.some(b => b.building_id === room.building_id)

            if (!buildingExists) {
                console.warn(`⚠️ Skipping Room ${room.room_num}: Building ID ${room.building_id} not found.`)
                continue
            }

            // Check if the room already exists before inserting
            const existingRoom = await Room.findOne({ room_num: room.room_num })

            if (!existingRoom) {
                await Room.create(room)
                console.log(`✅ Room ${room.room_num} added in Building ID ${room.building_id}.`)
            } else {
                console.warn(`⚠️ Room ${room.room_num} already exists. Skipping...`)
            }
        }

        console.log("✅ Room insertion process completed.")
    } catch (err) {
        console.error("⚠️ Error inserting rooms:", err)
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
        ]

        // Insert seats if they don't exist
        for (const seat of seats) {
            await Seat.findOneAndUpdate(
                { room_num: seat.room_num, seat_num: seat.seat_num }, // Search condition (unique key)
                seat, // Data to insert/update
                { upsert: true, new: true, setDefaultsOnInsert: true } // Upsert options
            )
        }

        console.log("✅ Seats inserted (if not duplicates)")
    } catch (err) {
        console.error("⚠️ Error inserting seats:", err)
    }
}

//hardcoded reservations
async function insertReservations() {
    try {
        // Fetch user IDs dynamically instead of hardcoding them
        const admin = await User.findOne({ email: "art@dlsu.edu.ph" })
        const admin2 = await User.findOne({ email: "john_fazbear@dlsu.edu.ph" })
        const student1 = await User.findOne({ email: "jeremiah_ang@dlsu.edu.ph" })
        const student2 = await User.findOne({ email: "charles_duelas@dlsu.edu.ph" })
        const student3 = await User.findOne({ email: "sung_woo@dlsu.edu.ph" })

        // Validate that all required users exist
        if (!admin || !admin2 || !student1 || !student2 || !student3) {
            console.error("❌ Error: One or more required users not found. Cannot create reservations.")
            return
        }

        // Define hardcoded reservations with dynamically fetched user IDs
        const reservations = [
            {
                email: student1.email,
                request_date: new Date("2025-03-01T10:00:00Z"),
                reserved_date: new Date("2025-03-02T14:00:00Z"),
                building_id: 1,
                room_num: "101",
                seat_num: 1,
                anonymous: "N",
                reserved_for_id: student1.email // Assigned to a student
            },
            {
                email: student3.email,
                request_date: new Date("2025-03-12T08:30:00Z"),
                reserved_date: new Date("2025-03-13T13:30:00Z"),
                building_id: 1,
                room_num: "104",
                seat_num: 3,
                anonymous: "N",
                reserved_for_id: student3.email // Assigned to a student
            },
            {
                email: student3.email,
                request_date: new Date("2025-03-05T11:30:00Z"),
                reserved_date: new Date("2025-03-06T09:00:00Z"),
                building_id: 1,
                room_num: "102",
                seat_num: 1,
                anonymous: "Y",
                reserved_for_id: null // Anonymous reservation
            },
            {
                email: student2.email,
                request_date: new Date("2025-03-10T14:45:00Z"),
                reserved_date: new Date("2025-03-11T16:00:00Z"),
                building_id: 1,
                room_num: "103",
                seat_num: 2,
                anonymous: "N",
                reserved_for_id: student2.email
            },
            // 🔹 New Anonymous Reservation
            {
                email: student3.email,
                request_date: new Date("2025-03-15T12:00:00Z"),
                reserved_date: new Date("2025-03-16T10:30:00Z"),
                building_id: 1,
                room_num: "105",
                seat_num: 4,
                anonymous: "Y", // ✅ Anonymous reservation
                reserved_for_id: null
            },
            // 🔹 New Non-Anonymous Reservation
            {
                email: admin1.email,
                request_date: new Date("2025-03-18T09:15:00Z"),
                reserved_date: new Date("2025-03-19T15:45:00Z"),
                building_id: 1,
                room_num: "106",
                seat_num: 1,
                anonymous: "N", // ✅ Non-anonymous reservation
                reserved_for_id: admin1.email
            }
        ]        

        // Insert reservations only if they don't exist
        for (const reservation of reservations) {
            const existingReservation = await Reservation.findOne({
                room_num: reservation.room_num,
                seat_num: reservation.seat_num,
                reserved_date: reservation.reserved_date
            })

            if (!existingReservation) {
                await Reservation.create(reservation)
                console.log(`✅ Reservation added for Room ${reservation.room_num}, Seat ${reservation.seat_num}`)
            } else {
                console.warn(`⚠️ Seat ${reservation.seat_num} in Room ${reservation.room_num} is already reserved.`)
            }
        }

        console.log("✅ Reservation process completed.")
    } catch (err) {
        console.error("⚠️ Error inserting reservations:", err)
    }
}


// Run all insert functions sequentially
async function runInserts() {
    await insertUsers()
    await insertBuildings()
    await insertRooms()
    await insertSeats()
    await insertReservations()
}
runInserts()

// Middleware to check if the user is a Lab Technician
const isLabTech = (req, res, next) => {
    if (req.session.user && req.session.user.account_type === "Lab Technician") {
        next()
    } else {
        res.status(403).json({ message: "Access denied. Only Lab Technicians can perform this action." })
    }
}

// LabTech Dashboard Table Data
app.get("/reservations", isLabTech, async (req, res) => {
    try {
        const reservations = await Reservation.find().lean();

        if (!reservations || reservations.length === 0) {
            console.warn("⚠️ No reservations found in the database.");
            return res.json([]);
        }

        const userEmails = reservations.map(res => res.email);
        const users = await User.find({ email: { $in: userEmails } }, "first_name last_name email").lean();

        // Create a map for quick lookup
        const userMap = {};
        users.forEach(user => {
            userMap[user.email] = `${user.first_name} ${user.last_name}`;
        });

        // Format the reservations with user data
        const formattedReservations = reservations.map(reservation => ({
            id: reservation._id,
            roomNumber: reservation.room_num || "N/A",
            seatNumber: `Seat #${reservation.seat_num}` || "N/A",
            date: reservation.reserved_date ? reservation.reserved_date.toISOString().split("T")[0] : "N/A",
            time: reservation.reserved_date ? reservation.reserved_date.toISOString().split("T")[1].slice(0,5) : "N/A",
            reservedBy: reservation.anonymous === "Y"
                ? "Anonymous"
                : userMap[reservation.email] || "⚠️ Unknown"
        }));

        res.json(formattedReservations);
    } catch (err) {
        console.error("⚠️ Error fetching reservations:", err)
        res.status(500).json({ message: "Error fetching reservations", error: err.message })
    }
});

// LabTech Dashboard Deletion Feature Route
app.delete('/reservations/:id', isLabTech, async (req, res) => {
    try {
        const reservationId = req.params.id;

        // Find and delete reservation
        const deletedReservation = await Reservation.findByIdAndDelete(reservationId);

        if (!deletedReservation) {
            return res.status(404).json({ message: "Reservation not found" });
        }

        console.log(`✅ Reservation ${reservationId} deleted successfully`);
        res.status(200).json({ message: "Reservation deleted successfully" });
    } catch (error) {
        console.error("⚠️ Error deleting reservation:", error);
        res.status(500).json({ message: "Error deleting reservation", error: error.message });
    }
});



/*
    SHA256 hash generation
    Reference: https://www.techiedelight.com/generate-sha-256-hash-javascript/
*/
function sha256(password) {
    // Create a hash object
    const hash = crypto.createHash('sha256')
 
    // Pass the input data to the hash object
    hash.update(password)
 
    // Get the output in hexadecimal format
    return hash.digest('hex')
}

// Route to INDEX.HTML
// localhost:3000/
app.get('\\', function(req,res){

    res.sendFile(__dirname + '\\' + 'index.html')
})

// Route to register.html
// localhost:3000/register
app.get('/register', function(req,res){

    res.sendFile(__dirname + '\\' + 'register.html')
})

// USER REGISTRATION
app.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, password, account_type } = req.body

        // Validate request body
        if (!first_name || !last_name || !email || !password || !account_type) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ message: "Email already in use" })
        }

        // Hash the password
        const hashedPassword = sha256(password)

        // Create new user
        const newUser = new User({
            email,
            first_name,
            last_name,
            
            password: hashedPassword,
            account_type,
            profile_picture: "profile_pics/default_avatar.jpg"
        })

        await newUser.save()
        console.log("✅ New user registered:", email)

        res.status(201).json({ message: "User registered successfully!" })
    } catch (err) {
        console.error("⚠️ Error registering user:", err)
        res.status(500).json({ message: "Internal server error" })
    }
})

// Route to login.html
// localhost:3000/login
app.get('/login', async function(req, res) {
    if (req.session.user) {
        res.redirect('/dashboard')
    } else if (req.cookies.rememberMe) {
        try {
            const user = await User.findById(req.cookies.rememberMe)
            if (user) {
                req.session.user = user
                res.redirect('/dashboard')
            } else {
                res.sendFile(__dirname + '/login.html')
            }
        } catch (err) {
            console.error("⚠️ Error checking rememberMe cookie:", err)
            res.sendFile(__dirname + '/login.html')
        }
    } else {
        res.sendFile(__dirname + '/login.html')
    }
})

// SUBMIT LOGIN CREDENTIALS ROUTE
app.post("/login", express.urlencoded({extended: true}), async(req,res) => {
    const { email, password, rememberMe } = req.body

    console.log("Email: ", email)
    console.log("Pass: ", sha256(password))

    try {
        // Check if user email is registered in database
        const existingUser = await User.findOne({ email: email })

        // Compare with the stored hashed password
        if (existingUser.password === sha256(password)) {
            console.log("signed in")
            req.session.user = existingUser

            // Set a long-lived cookie if "Remember Me" is checked
            if (rememberMe) {
                res.cookie("rememberMe", existingUser._id.toString(), { maxAge: 1814400000, httpOnly: true }) // 3 weeks
            }

            res.cookie("sessionId", req.sessionID)

            // Student Route
            if (existingUser.account_type == "Student")
                res.redirect('/dashboard')
            // Lab Technician Route
            else
                res.redirect("/labtech")
        } else {
            res.send("Wrong password")
        }
    } catch (err) {
        res.status(401).send("Invalid credentials. <a href='login'>Please try again</a>")
    }
})

// Profile Page
app.get('/profile', isAuthenticated, (req,res) => {
    const userData = req.session.user
    console.log(userData)

    res.render('profile', {userData})
})

app.use(fileUpload()) // for fileuploads

// DONE: Change profile pic route (MAR 12)
/* Copied from the all-in-one-backend kit */
app.post('/profile', isAuthenticated, async(req, res) => {

    // Check if file was uploaded
    if (!req.files || Object.keys(req.files).length === 0)
        return res.status(400).send('No files were uploaded.')
    
    
    const userData = req.session.user
    const { profile_picture } = req.files
    
        if (!userData) {
            return res.status(401).send('Unauthorized')
        }
    
        try {
            const fileIdentifier = req.session.user.last_name + '_' + req.session.user.first_name + '_'
            // Move uploaded file
            await profile_picture.mv(path.resolve(__dirname, 'uploads/profile_pics', fileIdentifier + profile_picture.name))
    
            const updatedData = {
                ...req.body,
                profile_picture: 'profile_pics/' + fileIdentifier + profile_picture.name
            }
    
        // Update user data
            const updatedUser = await User.findByIdAndUpdate(userData._id, updatedData, { new: true })
            req.session.user = updatedUser // Update session user data
    
            res.redirect('/profile')
        } 
        catch (error) {
            console.log("Error!", error)
            res.status(500).send('Error updating user')
        }
        
})

app.post('/profile', isAuthenticated, async (req, res) => {
    try {
        const userData = req.session.user;
        const { first_name, last_name, description } = req.body;

        const updatedData = {};
        if (first_name) updatedData.first_name = first_name;
        if (last_name) updatedData.last_name = last_name;
        if (description) updatedData.description = description;

        if (Object.keys(updatedData).length > 0) {
            const updatedUser = await User.findByIdAndUpdate(userData._id, updatedData, { new: true });
            req.session.user = updatedUser; // Update session with new user data
            console.log("✅ Profile updated:", updatedData);

        } else {
            return res.status(400).json({ success: false, message: "No changes made." });
        }
    } catch (err) {
        console.error("⚠️ Error updating profile:", err);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
});

// DONE: Change password Route (MAR 12)
app.post('/changepassword', isAuthenticated, async (req, res) => {
    try {
        const { newPassword, confirmPassword } = req.body;
        const user_id = req.session.user._id;

        // Check if passwords match
        if (newPassword !== confirmPassword) {
            return res.status(400).send("<script>alert('Passwords do not match!'); window.location='/profile';</script>");
        }

        // Hash new password
        const hashedPassword = sha256(newPassword);

        // Update password in the database
        await User.findByIdAndUpdate(user_id, { password: hashedPassword });

        console.log(`✅ Password updated for user: ${req.session.user.email}`);

        // Destroy session to log user out
        req.session.destroy((err) => {
            if (err) {
                console.error("⚠️ Error logging out after password change:", err);
                return res.status(500).send("<script>alert('Error logging out. Please try again.'); window.location='/profile';</script>");
            }

            // Clear session-related cookies
            res.clearCookie("sessionId");
            res.clearCookie("rememberMe");

        });

    } catch (err) {
        console.error("⚠️ Error updating password:", err);
        res.status(500).send("<script>alert('Internal server error'); window.location='/profile';</script>");
    }
});


//Delete User Route (Mar 12)
app.delete('/deleteaccount', isAuthenticated, async (req, res) => {
    try {
        const user_id = req.session.user._id;

        // Find and delete the user
        const deletedUser = await User.findByIdAndDelete(user_id);

        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(`❌ User deleted: ${deletedUser.email}`);

        // Destroy session and log out
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ message: "Error logging out after deletion" });
            }

            res.clearCookie("sessionId");
            res.clearCookie("rememberMe");

            res.status(200).json({ message: "Account deleted successfully!" });
        });

    } catch (err) {
        console.error("⚠️ Error deleting user:", err);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Route to labtech handlebar (MUST DEPEND ON USER SESSION)
app.get('/labtech', isAuthenticated, (req,res) => {
    const userData = req.session.user
    console.log(userData)

    res.render('labtech', {userData})
})


// Route to reservation handlebar (MUST DEPEND ON USER SESSION)
app.get('/reserve', isAuthenticated, async(req,res) => {
    const userData = req.session.user
    console.log(userData)

    res.render('reserve', {userData})
})

// Route to dashboard handlebar (MUST DEPEND ON USER SESSION)
app.get('/dashboard', isAuthenticated, async(req,res) => {
    const userData = req.session.user
    console.log(userData)

    res.render('dashboard', {userData})
})

// CREATE A RESERVATION
app.post('/reserve', isAuthenticated, async (req, res) => {
    try {
        const { room_num, seat_num, reserved_date, anonymous } = req.body
        const user_id = req.session.user._id // Get logged-in user

        // Check if seat is already reserved
        const existingReservation = await Reservation.findOne({ room_num, seat_num, reserved_date })
        if (existingReservation) {
            return res.status(400).json({ message: "Seat already reserved for this date" })
        }

        // Create reservation
        const newReservation = new Reservation({
            user_id,
            request_date: new Date(),
            reserved_date: new Date(reserved_date),
            room_num,
            seat_num,
            anonymous: anonymous === "Y" ? "Y" : "N",
            reserved_for_id: anonymous === "Y" ? null : user_id // Set null if anonymous
        })

        await newReservation.save()
        console.log(`✅ Reservation created by ${req.session.user.first_name}`)

        res.status(201).json({ message: "Reservation created successfully!" })
    } catch (err) {
        console.error("⚠️ Error creating reservation:", err)
        res.status(500).json({ message: "Internal server error" })
    }
})



// LOGOUT (destroy the session)
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if(err)
            return res.status(500).send("Error logging out")

        res.clearCookie('sessionId')
        res.clearCookie('rememberMe')
        res.redirect('\\')
    })
})

// Server listens on port 3000
var server = app.listen(3000, function(){
    console.log("Labyrinth Node Server is listening on port 3000...")
})