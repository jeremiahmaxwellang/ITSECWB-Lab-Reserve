document.addEventListener("DOMContentLoaded", function () {
    console.log("Lab Tech Dashboard Loaded");

    const reservations = [
        { roomNumber: "GK01", seatNumber: "Seat #01", dateTime: "August 5, 2025 - 01:01:01 PM" },
        { roomNumber: "GK02", seatNumber: "Seat #02", dateTime: "August 6, 2025 - 02:30:00 PM" },
        { roomNumber: "GK03", seatNumber: "Seat #03", dateTime: "August 7, 2025 - 10:15:00 AM" },
        { roomNumber: "GK04", seatNumber: "Seat #04", dateTime: "August 8, 2025 - 04:45:00 PM" }
    ];

    function renderTable() {
        const tableBody = document.querySelector("#reservationsTable tbody");
        tableBody.innerHTML = ""; 

        reservations.forEach((reservation, index) => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = reservation.roomNumber;
            row.insertCell(1).innerText = reservation.seatNumber;
            row.insertCell(2).innerText = reservation.dateTime;

            // Action Cell
            const actionCell = row.insertCell(3);
            const buttonContainer = document.createElement("div");
            buttonContainer.classList.add("button-container");

            // Edit Button
            const editButton = document.createElement("button");
            editButton.className = "editButton";
            editButton.innerText = "Edit";
            buttonContainer.appendChild(editButton);

            // Delete Button
            const deleteButton = document.createElement("button");
            deleteButton.className = "deleteButton";
            deleteButton.innerText = "Delete";
            deleteButton.setAttribute("data-index", index);
            buttonContainer.appendChild(deleteButton);

            // Append Button Container
            actionCell.appendChild(buttonContainer);
        });

        attachDeleteEventListeners();
    }

    function attachDeleteEventListeners() {
        document.querySelectorAll(".deleteButton").forEach(button => {
            button.addEventListener("click", function () {
                const index = this.getAttribute("data-index");
                showDeleteOverlay(index);
            });
        });
    }

    function showDeleteOverlay(index) {
        console.log(`Deleting reservation at index: ${index}`);

        const deletePopup = document.querySelector("#deletePopUp");
        const deleteRoom = document.querySelector("#deleteRoom");
        const deleteSeat = document.querySelector("#deleteSeat");
        const deleteDate = document.querySelector("#deleteDate");

        const reservation = reservations[index];

        deleteRoom.innerText = reservation.roomNumber;
        deleteSeat.innerText = reservation.seatNumber;
        deleteDate.innerText = reservation.dateTime;

        deletePopup.classList.add("active");

        document.querySelector(".cancelButton").addEventListener("click", () => deletePopup.classList.remove("active"));

        document.querySelector(".confirmButton").addEventListener("click", function () {
            reservations.splice(index, 1);
            renderTable();
            deletePopup.classList.remove("active");
        });

        document.querySelector(".close-overlay").addEventListener("click", () => deletePopup.classList.remove("active"));
    }

    renderTable();
});
