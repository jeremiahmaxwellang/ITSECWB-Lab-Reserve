document.addEventListener('DOMContentLoaded', function () {
    console.log("Lab Tech Dashboard Loaded");

    const reservations = [
        { roomNumber: 'GK01', seatNumber: 'Seat #01', date: '2025-08-05', time: '13:01', reservedBy: 'John Doe' },
        { roomNumber: 'GK02', seatNumber: 'Seat #02', date: '2025-08-06', time: '14:30', reservedBy: 'Jane Smith' },
        { roomNumber: 'GK03', seatNumber: 'Seat #03', date: '2025-08-07', time: '10:15', reservedBy: 'Alice Brown' },
        { roomNumber: 'GK04', seatNumber: 'Seat #04', date: '2025-08-08', time: '16:45', reservedBy: 'Bob Johnson' }
    ];

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

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

    function generateTimeSlot(startTime) {
        const [hour, minute] = startTime.split(":").map(Number);
        const startDate = new Date();
        startDate.setHours(hour, minute, 0);

        let endDate = new Date(startDate);
        endDate.setMinutes(startDate.getMinutes() + 30);

        return `${formatTime(startTime)} - ${formatTime(`${endDate.getHours()}:${endDate.getMinutes()}`)}`;
    }

    function renderTable() {
        const tableBody = document.querySelector('#reservationsTable tbody');
        tableBody.innerHTML = ""; // Clear existing content

        reservations.forEach((reservation, index) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = reservation.roomNumber;
            row.insertCell(1).innerText = reservation.seatNumber;
            row.insertCell(2).innerText = formatDate(reservation.date);
            row.insertCell(3).innerText = generateTimeSlot(reservation.time);
            row.insertCell(4).innerText = reservation.reservedBy; // Reserved By column

            // Create Edit & Delete Button Container
            const actionCell = row.insertCell(5);
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");

            // Create Edit Button
            const editButton = document.createElement("button");
            editButton.className = "editButton";
            editButton.innerText = "Edit";
            buttonContainer.appendChild(editButton);

            // Create Delete Button
            const deleteButton = document.createElement("button");
            deleteButton.className = "deleteButton";
            deleteButton.innerText = "Delete";
            deleteButton.onclick = () => showDeleteConfirmation(index);
            buttonContainer.appendChild(deleteButton);

            // Append button container inside the cell
            actionCell.appendChild(buttonContainer);
        });
    }

    function showDeleteConfirmation(index) {
        const deleteModal = document.getElementById("deleteModal");
        const roomSpan = document.getElementById("deleteRoom");
        const seatSpan = document.getElementById("deleteSeat");
        const dateSpan = document.getElementById("deleteDate");
        const timeSpan = document.getElementById("deleteTime");
        const reservedBySpan = document.getElementById("deleteReservedBy");

        roomSpan.textContent = reservations[index].roomNumber;
        seatSpan.textContent = reservations[index].seatNumber;
        dateSpan.textContent = formatDate(reservations[index].date);
        timeSpan.textContent = generateTimeSlot(reservations[index].time);
        reservedBySpan.textContent = reservations[index].reservedBy; // Show who reserved it

        deleteModal.classList.add("active");

        // Confirm Delete
        document.querySelector(".confirm-button").onclick = function () {
            reservations.splice(index, 1);
            renderTable();
            deleteModal.classList.remove("active");
        };
    }

    // Close modal on cancel or overlay click
    document.querySelector(".cancel-button").addEventListener("click", function () {
        document.getElementById("deleteModal").classList.remove("active");
    });

    document.querySelector(".close-button").addEventListener("click", function () {
        document.getElementById("deleteModal").classList.remove("active");
    });

    renderTable(); // Initial render
});
