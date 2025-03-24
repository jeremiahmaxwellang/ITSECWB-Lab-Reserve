document.addEventListener("DOMContentLoaded", function () {
    const roomContainer = document.getElementById("room-container");
    const roomTitle = document.getElementById("room-title");
    const floorNumbers = document.querySelectorAll(".floor-number");
    const sliderThumb = document.querySelector(".floor-slider-thumb");
    const buildingDropdown = document.getElementById("building-location");

    const floorPositions = [0, 67, 140, 160, 229];
    let selectedFloor = 1;
    let selectedBuilding = "";

    function fetchRooms(building, floor) {
        if (!building || !floor) return;

        fetch(`/available-rooms?building=${encodeURIComponent(building)}&floor=${floor}`)
            .then(response => response.json())
            .then(data => {
                roomContainer.innerHTML = "";
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
                roomContainer.innerHTML = "<p class='error-message'>Failed to load rooms.</p>";
            });
    }

    buildingDropdown.addEventListener("change", function () {
        selectedBuilding = buildingDropdown.value;
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

    sliderThumb.style.transform = `translateX(${floorPositions[0]}px)`;
    floorNumbers[0].classList.add("selected");
});

document.getElementById("student-selection").addEventListener("change", function () {
    const selectedStudentId = this.value;
    console.log("Selected Student ID: ", selectedStudentId);
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

    const roomNameElement = document.createElement("h2");
    roomNameElement.textContent = `${roomName}`;
    reservationDetails.appendChild(roomNameElement);

    const dateTimeContainer = document.createElement("div");
    dateTimeContainer.classList.add("date-time-container");

    const datePickerContainer = document.createElement("div");
    datePickerContainer.classList.add("date-picker-container");

    const datePickerLabel = document.createElement("label");
    datePickerLabel.textContent = "Select Date:";

    const datePicker = document.createElement("input");
    datePicker.id = "datePicker";
    datePicker.type = "date";
    datePicker.min = new Date().toISOString().split("T")[0];
    datePicker.value = new Date().toISOString().split("T")[0];
    datePickerContainer.appendChild(datePickerLabel);
    datePickerContainer.appendChild(datePicker);

    const timePickerContainer = document.createElement("div");
    timePickerContainer.classList.add("time-picker-container");

    const timePickerLabel = document.createElement("label");
    timePickerLabel.textContent = "Select Time:";

    const timePicker = document.createElement("select");
    timePicker.id = "timePicker";

    for (let hour = 8; hour <= 19; hour++) {
        for (let minute of [0, 30]) {
            let startHour = String(hour).padStart(2, "0");
            let startMinute = String(minute).padStart(2, "0");

            let endHour = hour;
            let endMinute = minute + 30;
            if (endMinute >= 60) {
                endMinute -= 60;
                endHour += 1;
            }

            let optionText = `${startHour}:${startMinute} - ${String(endHour).padStart(2, "0")}:${String(endMinute).padStart(2, "0")}`;

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

    const seatInfoOverlay = document.createElement("div");
    seatInfoOverlay.classList.add("seat-info-overlay");
    seatInfoOverlay.innerHTML = `<p>Select a seat to see details.</p>`;
    reservationDetails.appendChild(seatInfoOverlay);

    const seatLayout = document.createElement("div");
    seatLayout.classList.add("seat-layout");

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

    seatPositions.forEach((row, seatIndex) => {
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
                        if (selectedSeat) {
                            selectedSeat.src = selectedSeat.classList.contains("available") ? "images/GreenSeat.svg" : "images/RedSeat.svg";
                            selectedSeat.classList.remove("selected");
                        }

                        selectedSeat = seat;
                        seat.src = "images/BlueSeat.svg";
                        seat.classList.add("selected");

                        if (seat.classList.contains("available")) {
                            seatInfoOverlay.innerHTML = `
                                <form method="post" action="/labtechReserve">
                                    <p class="available-text">This Seat Is Available</p>
                                    <div class="anonymous-container">
                                        <input type="checkbox" id="anonymousCheckbox" class="anonymous-checkbox" name="anonymous-checkbox" value="Y">
                                        <label for="anonymousCheckbox" class="anonymous-label">Anonymous</label>
                                    </div>
                                    <input type="text" id="anonStatus" name="anonymous">
                                    <input type="text" id="reserved_date" name="reserved_date">
                                    <input type="text" id="building_id" name="building_id">
                                    <input type="text" id="room_num" name="room_num">
                                    <input type="text" id="seat_num" name="seat_num">
                                    <input type="hidden" id="reservedForEmail" name="reservedForEmail">
                                    <button type="submit" class="confirm-btn">Confirm</button>
                                </form>
                            `;

                            function updateDateTime() {
                                const reservedDate = new Date(`${datePicker.value}T${timePicker.value}:00.000Z`);
                                document.getElementById("reserved_date").value = reservedDate.toISOString();
                            }

                            const myBuildingDropdown = document.getElementById("building-location");
                            const building_id = myBuildingDropdown.selectedIndex;
                            const seat_num = seatIndex + 1;

                            const anonymousCheckbox = document.getElementById("anonymousCheckbox");
                            anonymousCheckbox.addEventListener("change", () => {
                                document.getElementById("anonStatus").value = anonymousCheckbox.checked ? "Y" : "N";
                            });

                            updateDateTime();
                            document.getElementById("building_id").value = building_id;
                            document.getElementById("room_num").value = roomName;
                            document.getElementById("seat_num").value = seat_num;
                            document.getElementById("anonStatus").value = "N";

                            // ✅ Set reservedForEmail from dropdown
                            const studentDropdown = document.getElementById("student-selection");
                            const selectedStudentOption = studentDropdown.options[studentDropdown.selectedIndex];
                            const reservedEmail = selectedStudentOption?.getAttribute("data-email");
                            document.getElementById("reservedForEmail").value = reservedEmail || "";
                        } else {
                            seatInfoOverlay.innerHTML = `
                                <p class="occupied-text">This seat is Occupied by:</p>
                                <p class="occupied-email">kyle_dejesus@dlsu.edu.ph</p>
                            `;
                        }

                        document.querySelector(".confirm-btn")?.addEventListener("click", () => {
                            const seatNo = document.getElementById("seat_num").value;
                            showConfirmationOverlay(roomName, datePicker.value, timePicker.value, seatNo);
                            document.getElementById("building-location").value = "Select a Building";
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
    closeButton.innerHTML = '<i class="fas fa-times"></i>';
    closeButton.addEventListener("click", () => {
        document.body.removeChild(overlay);
    });

    overlayContent.appendChild(closeButton);
    overlay.appendChild(overlayContent);
    document.body.appendChild(overlay);
}

function showConfirmationOverlay(roomName, date, time, seatNumber) {
    const confirmationOverlay = document.createElement("div");
    confirmationOverlay.classList.add("overlay");

    const confirmationContent = document.createElement("div");
    confirmationContent.classList.add("confirmation-content");

    // Extract username
    const name = document.getElementById("username").textContent;

    // Extract day & month
    const tempDate = new Date(date);
    const day = tempDate.getDate(); 
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = months[tempDate.getMonth()];

    // Extract time
    const timeString = time;
    const [hours, minutes] = timeString.split(":").map(Number);

    function padWithZero(number) {
        return number.toString().padStart(2, "0");
    }

    const startingTime = new Date()
    startingTime.setHours(hours)
    startingTime.setMinutes(minutes)
    

    let startString = `${padWithZero(startingTime.getHours())}:${padWithZero(startingTime.getMinutes())}`;

    const endingTime = new Date()
    endingTime.setHours(hours)
    endingTime.setMinutes(minutes+30)

    let endString = endingTime.getHours() + ":" + endingTime.getMinutes();


    // Extract seat number
    const seat = new Number(seatNumber);

    // Building Name
    const building = document.getElementById("building-location").value;


    confirmationContent.innerHTML = `
        <div class="confirmation-header">
            <i class="fas fa-check-circle"></i>
            <h2>Your Reservation is <span class="confirmed-text">Confirmed</span></h2>
        </div>
        <hr>
        <p class="confirmation-message">Hi, ${name}</p>
        <p class="confirmation-subtext">
            You have successfully reserved a room and slot, please review your reservation details below
        </p>
        
        <div class="confirmation-container">
            <img class="room-image" src="images/goksdiv.png" alt="Room Image">
            <div class="confirmation-details">
                <h1 class="reservation-date">${day}</h1>
                <p class="reservation-month">${month}</p>
                <p class="reservation-time">${startString} - ${endString}</p>
                <hr>
                <p class="reservation-reference">Seat #${seat}</p>
                <p class="reservation-building">Building: ${building}</p>
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