document.addEventListener('DOMContentLoaded', function () {
    console.log("Lab Tech Dashboard Loaded");

    const reservations = [
        { roomNumber: 'GK01', seatNumber: 'Seat #01', dateTime: 'August 5, 2025 - 01:01:01 PM' },
        { roomNumber: 'GK02', seatNumber: 'Seat #02', dateTime: 'August 6, 2025 - 02:30:00 PM' },
        { roomNumber: 'GK03', seatNumber: 'Seat #03', dateTime: 'August 7, 2025 - 10:15:00 AM' },
        { roomNumber: 'GK04', seatNumber: 'Seat #04', dateTime: 'August 8, 2025 - 04:45:00 PM' }
    ];

    function renderTable() {
        const tableBody = document.querySelector('#reservationsTable tbody');
        tableBody.innerHTML = ""; // Clear existing content

        reservations.forEach((reservation, index) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = reservation.roomNumber;
            row.insertCell(1).innerText = reservation.seatNumber;
            row.insertCell(2).innerText = reservation.dateTime;

            // Create Edit & Delete Button Container
            const actionCell = row.insertCell(3);
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

        roomSpan.textContent = reservations[index].roomNumber;
        seatSpan.textContent = reservations[index].seatNumber;
        dateSpan.textContent = reservations[index].dateTime;

        deleteModal.classList.add("active");

        // Confirm Delete
        document.querySelector(".confirm-button").onclick = function () {
            reservations.splice(index, 1); // Remove from array
            renderTable(); // Re-render table
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
