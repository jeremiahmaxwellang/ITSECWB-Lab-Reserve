document.addEventListener("DOMContentLoaded", function () {
    console.log("Dashboard script loaded successfully.");

    // Get table elements
    const currentTableBody = document.querySelector("#currentReservationsTable tbody");
    const recentTableBody = document.querySelector("#recentReservationsTable tbody");

    if (!currentTableBody || !recentTableBody) {
        console.error("Table body elements not found in DOM.");
        return;
    }

    // Function to format date as "Month Day, Year"
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

    // Function to format time in AM/PM format
    function formatTime(timeString) {
        const [hour, minute] = timeString.split(":").map(Number);
        const date = new Date();
        date.setHours(hour, minute, 0);

        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;

        return `${hours}:${minutes} ${ampm}`;
    }

    // Function to generate 30-minute interval
    function generateTimeSlot(startTime) {
        const [hour, minute] = startTime.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hour, minute, 0);

        let endDate = new Date(startDate);
        endDate.setMinutes(startDate.getMinutes() + 30); // Add 30 minutes

        return `${formatTime(startTime)} - ${formatTime(`${endDate.getHours()}:${endDate.getMinutes()}`)}`;
    }

    // Updated reservation data with separate date and time
    const currentReservations = [
        { roomNumber: "GK01", seatNumber: "Seat #01", date: "2025-08-05", time: "08:00" },
        { roomNumber: "GK02", seatNumber: "Seat #02", date: "2025-08-06", time: "09:30" },
        { roomNumber: "GK03", seatNumber: "Seat #03", date: "2025-08-07", time: "11:00" },
        { roomNumber: "GK04", seatNumber: "Seat #04", date: "2025-08-08", time: "14:30" },
    ];

    const recentReservations = [
        { roomNumber: "GK01", seatNumber: "Seat #01", date: "2025-08-01", time: "08:30", reservedBy: "John Reservation" },
        { roomNumber: "GK02", seatNumber: "Seat #02", date: "2025-08-02", time: "10:30", reservedBy: "Jane Doe" },
        { roomNumber: "GK03", seatNumber: "Seat #03", date: "2025-08-03", time: "13:00", reservedBy: "Alice Smith" },
        { roomNumber: "GK04", seatNumber: "Seat #04", date: "2025-08-04", time: "16:00", reservedBy: "Bob Johnson" },
    ];

    function populateTable(data, tableBody, isCurrent) {
        tableBody.innerHTML = ""; // Clear previous content

        data.forEach((reservation) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = reservation.roomNumber;
            row.insertCell(1).innerText = reservation.seatNumber;
            row.insertCell(2).innerText = formatDate(reservation.date); // Date Column
            row.insertCell(3).innerText = generateTimeSlot(reservation.time); // 30-minute Time Slot Column

            if (isCurrent) {
                // Add Edit button for Current Reservations
                const editCell = row.insertCell(4);
                const editButton = document.createElement("button");
                editButton.className = "edit-button";
                editButton.innerText = "Edit";
                editButton.onclick = function () {
                    window.location.href = "Reservation.html";
                };
                editCell.appendChild(editButton);
            } else {
                // Add "Reserved By" column for Recent Reservations
                row.insertCell(4).innerText = reservation.reservedBy;
            }
        });
    }

    // Populate tables dynamically
    populateTable(currentReservations, currentTableBody, true);
    populateTable(recentReservations, recentTableBody, false);
});
