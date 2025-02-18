document.addEventListener("DOMContentLoaded", function () {
    const rooms = [
        { name: "GK101", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK102", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK103", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK104", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK105", capacity: 20, projectors: 1, servers: 0 },
        { name: "GK106", capacity: 20, projectors: 1, servers: 0 }
    ];

    const roomContainer = document.getElementById("room-container");

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

        roomDiv.addEventListener("click", () => {
            showOverlay(room.name);
        });

        roomContainer.appendChild(roomDiv);
    });

    // 📌 Restore Floor Slider Logic
    const floorNumbers = document.querySelectorAll(".floor-number");
    const sliderThumb = document.querySelector(".floor-slider-thumb");

    const floorPositions = [0, 60, 110, 160, 229]; // Positions for slider

    floorNumbers.forEach((floor, index) => {
        floor.addEventListener("click", function () {
            sliderThumb.style.transform = `translateX(${floorPositions[index]}px)`;

            floorNumbers.forEach(f => f.classList.remove("selected"));
            floor.classList.add("selected");
        });
    });

    sliderThumb.style.transform = `translateX(${floorPositions[0]}px)`;
    floorNumbers[0].classList.add("selected");
});

function showOverlay(roomName) {
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    const overlayContent = document.createElement("div");
    overlayContent.classList.add("overlay-content");

    // 📌 Main Overlay Container
    const mainOverlayContainer = document.createElement("div");
    mainOverlayContainer.classList.add("main-overlay-container");

    
    // 📌 LEFT SIDE - Reservation Details
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
    datePicker.type = "date";
    datePicker.min = new Date().toISOString().split("T")[0];
    datePickerContainer.appendChild(datePickerLabel);
    datePickerContainer.appendChild(datePicker);

    // Time Picker
    const timePickerContainer = document.createElement("div");
    timePickerContainer.classList.add("time-picker-container");
    const timePickerLabel = document.createElement("label");
    timePickerLabel.textContent = "Select Time:";
    const timePicker = document.createElement("select");
    for (let hour = 8; hour <= 20; hour++) {
        for (let minute of ["00", "30"]) {
            const option = document.createElement("option");
            option.value = `${String(hour).padStart(2, "0")}:${minute}`;
            option.textContent = option.value;
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

    // 📌 RIGHT SIDE - Seat Layout
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
                    seat.src = "assets/images/GreenSeat.svg";
                    seat.classList.add("available");
                } else if (type === "R") {
                    seat.src = "assets/images/RedSeat.svg";
                    seat.classList.add("reserved");
                }

                seat.addEventListener("click", () => {
                    if (seat.classList.contains("available")) {
                        if (selectedSeat) {
                            selectedSeat.src = "assets/images/GreenSeat.svg";
                            selectedSeat.classList.remove("selected");
                        }
                        selectedSeat = seat;
                        seat.src = "assets/images/BlueSeat.svg";
                        seat.classList.add("selected");

                        seatInfoOverlay.innerHTML = `
                        <p class="available-text">This Seat Is Available</p>
                        <div class="anonymous-container">
                            <input type="checkbox" id="anonymousCheckbox" class="anonymous-checkbox">
                            <label for="anonymousCheckbox" class="anonymous-label">Anonymous</label>
                        </div>
                        <button class="confirm-btn">Confirm</button>
                    `;
                    
                    } else if (seat.classList.contains("reserved")) {
                        seatInfoOverlay.innerHTML = `
                            <p class="occupied-text">This seat is Occupied by:</p>
                            <p class="occupied-email">kyle_dejesus@dlsu.edu.ph</p>
                        `;
                    }
                });

                seatRow.appendChild(seat);
            });

            seatContainer.appendChild(seatRow);
        }
    });

    seatLayout.appendChild(seatContainer);

    // 📌 Add "Front" label
    const frontLabel = document.createElement("div");
    frontLabel.classList.add("front-label");
    frontLabel.textContent = "Front";
    seatLayout.appendChild(frontLabel);

    mainOverlayContainer.appendChild(reservationDetails);
    mainOverlayContainer.appendChild(seatLayout);
    overlayContent.appendChild(mainOverlayContainer);

// 📌 Create Close Button (Top Right)
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
