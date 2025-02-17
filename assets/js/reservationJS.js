document.addEventListener("DOMContentLoaded", function() {
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

    // Floor Slider Logic
    const floorNumbers = document.querySelectorAll(".floor-number");
    const sliderThumb = document.querySelector(".floor-slider-thumb");

    const floorPositions = [0, 60, 110, 160, 229]; // Positions for slider

    floorNumbers.forEach((floor, index) => {
        floor.addEventListener("click", function() {
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

    const roomNameElement = document.createElement("h2");
    roomNameElement.textContent = ` ${roomName}`;
    overlayContent.appendChild(roomNameElement);

    // Date-Time Selection Container
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
    overlayContent.appendChild(dateTimeContainer);

    // Seat Layout
    const seatLayout = document.createElement("div");
    seatLayout.classList.add("seat-layout");

    function createDivider() {
        const divider = document.createElement("div");
        divider.classList.add("divider-bar");
        return divider;
    }

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

    seatPositions.forEach(row => {
        if (row[0] === "D") {
            seatContainer.appendChild(createDivider()); 
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
                        if (seat.src.includes("GreenSeat.svg")) {
                            seat.src = "assets/images/BlueSeat.svg"; 
                            seat.classList.add("selected");
                        } else {
                            seat.src = "assets/images/GreenSeat.svg"; 
                            seat.classList.remove("selected");
                        }
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

    overlayContent.appendChild(seatLayout);

    // Legend Container
    const legendContainer = document.createElement("div");
    legendContainer.classList.add("legend-container");

    function createLegendItem(color, text) {
        const legendItem = document.createElement("div");
        legendItem.classList.add("legend-item");

        const dot = document.createElement("span");
        dot.classList.add("legend-dot");
        dot.style.backgroundColor = color;

        const labelText = document.createElement("span");
        labelText.textContent = text;

        legendItem.appendChild(dot);
        legendItem.appendChild(labelText);

        return legendItem;
    }

    legendContainer.appendChild(createLegendItem("#900B09", "Reserved"));
    legendContainer.appendChild(createLegendItem("#1d5b3e", "Available"));
    legendContainer.appendChild(createLegendItem("#3580b2", "Selected"));

    overlayContent.appendChild(legendContainer);

    // Buttons
    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("button-container");

    const reserveButton = document.createElement("button");
    reserveButton.classList.add("overlay-btn", "reserve-button");
    reserveButton.textContent = "Reserve";
    reserveButton.addEventListener("click", () => {
        const selectedSeats = document.querySelectorAll(".seat-svg.selected").length;
        if (!datePicker.value || !timePicker.value || selectedSeats === 0) {
            alert("Please select a date, time, and at least one seat.");
        } else {
            alert(`Reservation confirmed for ${roomName} on ${datePicker.value} at ${timePicker.value} with ${selectedSeats} seat(s).`);
            document.body.removeChild(overlay);
        }
    });

    buttonContainer.appendChild(reserveButton);

    const closeButton = document.createElement("button");
    closeButton.classList.add("overlay-btn", "close-button");
    closeButton.textContent = "Close";
    closeButton.addEventListener("click", () => {
        document.body.removeChild(overlay);
    });

    buttonContainer.appendChild(closeButton);
    overlayContent.appendChild(buttonContainer);

    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);
}
