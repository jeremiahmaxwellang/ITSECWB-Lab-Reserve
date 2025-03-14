document.addEventListener("DOMContentLoaded", function () {
    const roomContainer = document.getElementById("room-container");
    const roomTitle = document.getElementById("room-title"); // Select the room title
    const floorNumbers = document.querySelectorAll(".floor-number");
    const sliderThumb = document.querySelector(".floor-slider-thumb");
    const buildingDropdown = document.getElementById("building-location");

    const floorPositions = [0, 60, 110, 160, 229]; // Adjust slider positions
    let selectedFloor = 1; // Default floor
    let selectedBuilding = ""; // Default empty (forces user to select)

    function fetchRooms(building, floor) {
        if (!building || !floor) return; // Prevent API call if missing values

        fetch(`/available-rooms?building=${encodeURIComponent(building)}&floor=${floor}`)
            .then(response => response.json())
            .then(data => {
                roomContainer.innerHTML = ""; // Clear existing rooms

                // Update title to "Available Rooms"
                roomTitle.textContent = "Available Rooms";

                if (data.success && data.rooms.length > 0) {
                    data.rooms.forEach(room => {
                        const roomDiv = document.createElement("div");
                        roomDiv.classList.add("room-box");
                        roomDiv.innerHTML = `
                            <img src="images/goksdiv.png" alt="Room Image">
                            <div class="divider"></div>
                            <div class="room-info">
                                <div class="room-name">${room.room_num}</div>
                                <div class="room-details">
                                    Capacity: 20 <br>
                                    Projectors: 1 <br>
                                    Servers: 0
                                </div>
                            </div>
                        `;

                        roomDiv.addEventListener("click", () => {
                            showOverlay(room.room_num);
                        });

                        roomContainer.appendChild(roomDiv);
                    });
                } else {
                    roomContainer.innerHTML = "<p class='no-rooms'>No available rooms in this building and floor.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching rooms:", error);
                document.getElementById("room-container").innerHTML = "<p class='error-message'>Failed to load rooms.</p>";
            });
    }

    // Run when the user selects a building
    buildingDropdown.addEventListener("change", function () {
        selectedBuilding = buildingDropdown.value;

        // Change title from "Choose a Building" to "Available Rooms"
        roomTitle.textContent = "Available Rooms";

        fetchRooms(selectedBuilding, selectedFloor);
    });

    floorNumbers.forEach((floor, index) => {
        floor.addEventListener("click", function () {
            selectedFloor = floor.dataset.floor;
            sliderThumb.style.transform = `translateX(${floorPositions[index]}px)`;

            floorNumbers.forEach(f => f.classList.remove("selected"));
            floor.classList.add("selected");

            fetchRooms(selectedBuilding, selectedFloor);
        });
    });

    // Set slider thumb to first floor by default
    sliderThumb.style.transform = `translateX(${floorPositions[0]}px)`;
    floorNumbers[0].classList.add("selected");
});

function showOverlay(roomName) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const overlayContent = document.createElement("div");
    overlayContent.classList.add("overlay-content");


    const mainOverlayContainer = document.createElement("div");
    mainOverlayContainer.classList.add("main-overlay-container");

    
    const reservationDetails = document.createElement("div");
    reservationDetails.classList.add("reservation-details");

    // Room Name Title
    const roomNameElement = document.createElement("h2");
    roomNameElement.textContent = `${roomName}`;
    reservationDetails.appendChild(roomNameElement);

    // Date-Time Selection
    const dateTimeContainer = document.createElement("div");
    dateTimeContainer.classList.add("date-time-container");

    // Date Picker
    const datePickerContainer = document.createElement("div");
    datePickerContainer.classList.add("date-picker-container");

    const datePickerLabel = document.createElement("label");
    datePickerLabel.textContent = "Select Date:";

    const datePicker = document.createElement("input");
    datePicker.id = "datePicker"; //datePicker ID
    datePicker.type = "date";
    
    datePicker.min = new Date().toISOString().split("T")[0];
    datePicker.value = new Date().toISOString().split("T")[0]; //display date today by default
    datePickerContainer.appendChild(datePickerLabel);
    datePickerContainer.appendChild(datePicker);

    // Time Picker
    const timePickerContainer = document.createElement("div");
    timePickerContainer.classList.add("time-picker-container");
    
    const timePickerLabel = document.createElement("label");
    timePickerLabel.textContent = "Select Time:";
    
    const timePicker = document.createElement("select");
    timePicker.id = "timePicker"
    
    for (let hour = 8; hour <= 19; hour++) { // Ends at 19:30
        for (let minute of [0, 30]) {
            let startHour = String(hour).padStart(2, "0");
            let startMinute = String(minute).padStart(2, "0");
    
            let endHour = hour;
            let endMinute = minute + 30;
            if (endMinute >= 60) {
                endMinute -= 60;
                endHour += 1;
            }
            let formattedEndHour = String(endHour).padStart(2, "0");
            let formattedEndMinute = String(endMinute).padStart(2, "0");
    
            let optionText = `${startHour}:${startMinute} - ${formattedEndHour}:${formattedEndMinute}`;
    
            const option = document.createElement("option");
            option.value = `${startHour}:${startMinute}`;
            option.textContent = optionText;
            timePicker.appendChild(option);
        }
    }
    
    timePickerContainer.appendChild(timePickerLabel);
    timePickerContainer.appendChild(timePicker);
    dateTimeContainer.appendChild(datePickerContainer);
    dateTimeContainer.appendChild(timePickerContainer);
    reservationDetails.appendChild(dateTimeContainer);

    // Seat Info Overlay (Dynamically Updated)
    const seatInfoOverlay = document.createElement("div");
    seatInfoOverlay.classList.add("seat-info-overlay");
    seatInfoOverlay.innerHTML = `<p>Select a seat to see details.</p>`;
    reservationDetails.appendChild(seatInfoOverlay);

    const seatLayout = document.createElement("div");
    seatLayout.classList.add("seat-layout");

    // Seat Container
    const seatContainer = document.createElement("div");
    seatContainer.classList.add("seat-container");

    const seatPositions = [
        ["R", "A", "R", "R", "R"],
        ["D"],
        ["R", "R", "R", "A", "R"],
        ["R", "R", "A", "R", "R"],
        ["D"],
        ["R", "A", "R", "A", "R"]
    ];

    let selectedSeat = null;

    seatPositions.forEach(row => {
        if (row[0] === "D") {
            const divider = document.createElement("div");
            divider.classList.add("divider-bar");
            seatContainer.appendChild(divider);
        } else {
            const seatRow = document.createElement("div");
            seatRow.classList.add("seat-row");
    
            row.forEach(type => {
                const seat = document.createElement("img");
                seat.classList.add("seat-svg");
    
                if (type === "A") {
                    seat.src = "images/GreenSeat.svg";
                    seat.classList.add("available");
                } else if (type === "R") {
                    seat.src = "images/RedSeat.svg";
                    seat.classList.add("reserved");
                }
    
                seat.addEventListener("click", () => {
                    if (seat.classList.contains("available") || seat.classList.contains("reserved")) {
                        // If another seat is already selected, reset it back to original color
                        if (selectedSeat) {
                            if (selectedSeat.classList.contains("available")) {
                                selectedSeat.src = "images/GreenSeat.svg";
                            } else if (selectedSeat.classList.contains("reserved")) {
                                selectedSeat.src = "images/RedSeat.svg";
                            }
                            selectedSeat.classList.remove("selected");
                        }
    
                        // Set new selected seat
                        selectedSeat = seat;
                        seat.src = "images/BlueSeat.svg";
                        seat.classList.add("selected");
    
                        // Update seat info overlay
                        if (seat.classList.contains("available")) {

                            seatInfoOverlay.innerHTML = `
                            <p class="available-text">This Seat Is Available</p>
                            <div class="anonymous-container">
                                <input type="checkbox" id="anonymousCheckbox" class="anonymous-checkbox">
                                <label for="anonymousCheckbox" class="anonymous-label">Anonymous</label>
                            </div>
                            <button class="confirm-btn">Confirm</button>
                        `;

                        // Seat Overlay with FORM (made by jer, mar 15)
                            // seatInfoOverlay.innerHTML = `
                            // <form method="post">
                            //     <p class="available-text">This Seat Is Available</p>
                            //     <div class="anonymous-container">
                            //         <input type="checkbox" id="anonymousCheckbox" class="anonymous-checkbox">
                            //         <label for="anonymousCheckbox" class="anonymous-label">Anonymous</label>
                            //     </div>
                            //     <button type="submit" class="confirm-btn">Confirm</button>
                            // </form>
                            // `;


                            
                        } else if (seat.classList.contains("reserved")) {
                            seatInfoOverlay.innerHTML = `
                                <p class="occupied-text">This seat is Occupied by:</p>
                                <p class="occupied-email">kyle_dejesus@dlsu.edu.ph</p>
                            `;
                        }
    
                        // CONFIRM BUTTON LISTENER
                        document.querySelector(".confirm-btn")?.addEventListener("click", () => {

                            // Set the reservedDate
                            // const datePicker = document.getElementById("datePicker")
                            console.log("reservedDate: ", datePicker.value);

                            // const timePicker = document.getElementById("timePicker");
                            console.log("reservedDate: ", timePicker.value);

                            let reservedDate = `${datePicker.value}T${timePicker.value}:00`;
                            reservedDate = new Date(reservedDate);
                            

                            const anonymousCheckbox = document.getElementById("anonymousCheckbox")
                            let anonStatus = "F"
                        
                            if(anonymousCheckbox.checked){
                                anonStatus = "T"
                            }

                            const myBuildingDropdown = document.getElementById("building-location")
                            const building_id =  myBuildingDropdown.selectedIndex; // Capture the selected building ID
                            

                            // function call to create reservation (jer, mar 15)
                            // createReservation(building_id, selectedRoomName, selectedSeat, anonStatus)

                            showConfirmationOverlay(roomName, datePicker.value, timePicker.value, selectedSeat);

                        });
                    }
                });
    
                seatRow.appendChild(seat);
            });
    
            seatContainer.appendChild(seatRow);
        }
    });
    
    
    
    
    seatLayout.appendChild(seatContainer);

    const frontLabel = document.createElement("div");
    frontLabel.classList.add("front-label");
    frontLabel.textContent = "Front";
    seatLayout.appendChild(frontLabel);

    mainOverlayContainer.appendChild(reservationDetails);
    mainOverlayContainer.appendChild(seatLayout);
    overlayContent.appendChild(mainOverlayContainer);

const closeButton = document.createElement("button");
closeButton.classList.add("close-button");
closeButton.innerHTML = '<i class="fas fa-times"></i>'; // Font Awesome X icon
closeButton.addEventListener("click", () => {
    document.body.removeChild(overlay);
});

    overlayContent.appendChild(closeButton);
    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);
}



// Create Reservations (jer, mar 15)
async function createReservation(reservedDate, building, roomName, seatNumber, anonStatus){

    console.log("Creating Reservation...");


// Check if the reservedDate is valid
if (isNaN(reservedDate.valueOf())) {
    console.error("Invalid reservedDate:", reservedDate);
    return; // Stop the reservation process if invalid
}

reservedDate = reservedDate.toISOString();
console.log("reservedDate:", reservedDate);


    const reservationData = {
        email: "test@dlsu.edu.ph", //CHANGE TO USER DATA LATER

        request_date: new Date().toISOString().split("T")[0],
        reserved_date: reservedDate,
    
        building_id: building,
        room_num: roomName,
        seat_num: seatNumber,
        
        anonymous: anonStatus,
        
    }
    // Labtech -> reserved_for_email: ???

    console.log("Adding reservation for ", reservationData.email, " at ", reservationData.roomName);

    try {
        const response = await fetch(`/reservations`, { 
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(reservationData)
        });

        if (response.ok) {
            console.log("✅ Reservation created successfully.");

        } else {
            console.error("⚠️ Failed to create reservation.");
        }
    } catch (error) {
        console.error("⚠️ Error creating reservation:", error);
    }
};



function showConfirmationOverlay(roomName, date, time, seatNumber) {
    const confirmationOverlay = document.createElement("div");
    confirmationOverlay.classList.add("overlay");

    const confirmationContent = document.createElement("div");
    confirmationContent.classList.add("confirmation-content");

    confirmationContent.innerHTML = `
        <div class="confirmation-header">
            <i class="fas fa-check-circle"></i>
            <h2>Your Reservation is <span class="confirmed-text">Confirmed</span></h2>
        </div>
        <hr>
        <p class="confirmation-message">Hi, Jeremiah</p>
        <p class="confirmation-subtext">
            You have successfully reserved a room and slot, please review your reservation details below
        </p>
        
        <div class="confirmation-container">
            <img class="room-image" src="images/goksdiv.png" alt="Room Image">
            <div class="confirmation-details">
                <h1 class="reservation-date">31</h1>
                <p class="reservation-month">February</p>
                <p class="reservation-time">${time} - ${time}</p>
                <hr>
                <p class="reservation-reference">Reference #: 12205931</p>
                <p class="reservation-building">Building: Gokongwei Hall</p>
                <p class="reservation-room">Room: ${roomName}</p>
            </div>
        </div>

        <button class="home-btn" onclick="window.location.href='/dashboard'">Go Back to Home Page</button>


        </button>
    `;

    confirmationOverlay.appendChild(confirmationContent);
    document.body.appendChild(confirmationOverlay);
}

function closeConfirmation() {
    document.querySelector(".overlay").remove();
}