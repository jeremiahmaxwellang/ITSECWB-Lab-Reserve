document.addEventListener("DOMContentLoaded", function() {
    // Room data array
    const rooms = [
        { name: "GK101", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK102", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK103", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK104", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK105", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK106", capacity: 20, projectors: 1, servers: 0 }
    ];

    // Get the container where rooms will be inserted
    const roomContainer = document.getElementById("room-container");

    // Loop through rooms and create HTML dynamically
    rooms.forEach(room => {
        const roomDiv = document.createElement("div");
        roomDiv.classList.add("room-box");
        roomDiv.innerHTML = `
            <img src="assets/images/goksdiv.png" alt="Room Image">
            <div class="divider"></div>
            <div class="room-info">
                <div class="room-name">${room.name}</div>
                <div class="room-details">
                    Capacity: ${room.capacity} <br>
                    Projectors: ${room.projectors} <br>
                    Servers: ${room.servers}
                </div>
            </div>
        `;

        // Click event to select room
        roomDiv.addEventListener("click", () => {
            showOverlay(room.name);
        });

        // Append room box to container
        roomContainer.appendChild(roomDiv);
    });
});

// Function to show overlay with date picker, time picker, and seat selection
function showOverlay(roomName) {
    // Create overlay container
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    // Create overlay content
    const overlayContent = document.createElement("div");
    overlayContent.classList.add("overlay-content");

    // Add room name
    const roomNameElement = document.createElement("h2");
    roomNameElement.textContent = `Reserve ${roomName}`;
    overlayContent.appendChild(roomNameElement);

    // Add date picker
    const datePickerLabel = document.createElement("label");
    datePickerLabel.textContent = "Select Date:";
    overlayContent.appendChild(datePickerLabel);

    const datePicker = document.createElement("input");
    datePicker.type = "date";
    datePicker.min = new Date().toISOString().split("T")[0]; // Disable past dates
    overlayContent.appendChild(datePicker);

    // Add time picker
    const timePickerLabel = document.createElement("label");
    timePickerLabel.textContent = "Select Time:";
    overlayContent.appendChild(timePickerLabel);

    const timePicker = document.createElement("select");

    // Generate time options in 30-minute intervals
    for (let hour = 0; hour < 24; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const option = document.createElement("option");
            option.value = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
            option.textContent = option.value;
            timePicker.appendChild(option);
        }
    }
    overlayContent.appendChild(timePicker);

    // Seat Selection
    const seatContainer = document.createElement("div");
    seatContainer.classList.add("seat-container");

    // Generate seats (5x5 grid)
    for (let i = 1; i <= 25; i++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.classList.add(Math.random() > 0.5 ? "available" : "unavailable");
        seat.addEventListener("click", () => {
            if (seat.classList.contains("available")) {
                seat.classList.toggle("selected");
            }
        });
        seatContainer.appendChild(seat);
    }
    overlayContent.appendChild(seatContainer);

    // Button Container
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    // Reserve button
    const reserveButton = document.createElement("button");
    reserveButton.classList.add("overlay-btn", "reserve-button");
    reserveButton.textContent = "Reserve";
    reserveButton.addEventListener("click", () => {
        const selectedDate = datePicker.value;
        const selectedTime = timePicker.value;
        const selectedSeats = document.querySelectorAll(".seat.selected").length;

        if (!selectedDate || !selectedTime || selectedSeats === 0) {
            alert("Please select a date, time, and at least one seat.");
        } else {
            alert(`Reservation confirmed for ${roomName} on ${selectedDate} at ${selectedTime} for ${selectedSeats} seat(s).`);
            document.body.removeChild(overlay); // Close overlay
        }
    });
    buttonContainer.appendChild(reserveButton);

    // Close button
    const closeButton = document.createElement("button");
    closeButton.classList.add("overlay-btn", "close-button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        document.body.removeChild(overlay); // Close overlay
    });
    buttonContainer.appendChild(closeButton);

    // Append buttons below the seat selection
    overlayContent.appendChild(buttonContainer);

    // Append overlay content to overlay
    overlay.appendChild(overlayContent);

    // Append overlay to body
    document.body.appendChild(overlay);
}

// Function to redirect to Dashboard.html
function redirectToDashboard() {
    window.location.href = "Dashboard.html";
}

// Function to redirect to Profile.html
function redirectToProfile() {
    window.location.href = "profile.html";
}

// Floor slider logic
document.addEventListener("DOMContentLoaded", function () {
    const floorNumbers = document.querySelectorAll(".floor-number");
    const sliderThumb = document.querySelector(".floor-slider-thumb");

    // Define slider positions for centering the thumb correctly
    const floorPositions = [0, 60, 110, 160, 229];

    floorNumbers.forEach((floor, index) => {
        floor.addEventListener("click", function () {
            // Move the slider thumb to the correct position
            sliderThumb.style.transform = `translateX(${floorPositions[index]}px)`;

            // Remove previous selected class
            floorNumbers.forEach(f => f.classList.remove("selected"));

            // Set active class to clicked floor
            floor.classList.add("selected");
        });
    });

    // Set default position to the 1st floor
    sliderThumb.style.transform = `translateX(${floorPositions[0]}px)`;
    floorNumbers[0].classList.add("selected"); // Ensure the first floor is selected on load
});
