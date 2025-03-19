document.addEventListener("DOMContentLoaded", function () {
    console.log("Lab Tech Dashboard Loaded");

    let reservations = [];

    // Fetch reservations from the backend
    async function fetchReservations() {
        try {
            const response = await fetch("/reservations");
            reservations = await response.json();
            console.log("🔍 Reservations Data:", reservations); // Debugging Log
    
            if (!Array.isArray(reservations) || reservations.length === 0) {
                console.warn("⚠️ No reservations available.");
                document.querySelector("#reservationsTable tbody").innerHTML =
                    `<tr><td colspan="6" style="text-align:center;">No reservations found.</td></tr>`;
                return;
            }
    
            renderTable();
        } catch (error) {
            console.error("⚠️ Error fetching reservations:", error);
        }
    }

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
        const tableBody = document.querySelector("#reservationsTable tbody");
        if (!tableBody) {
            console.error("❌ Table body not found!");
            return;
        }

        // Avoid clearing old table data, instead append new rows
        reservations.forEach((reservation, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${reservation.roomNumber}</td>
                <td>${reservation.seatNumber}</td>
                <td>${formatDate(reservation.date)}</td>
                <td>${generateTimeSlot(reservation.time)}</td>
                <td>${reservation.reservedBy || "⚠️ Unknown"}</td>
                <td class="button-container">
                    <button class="editButton" data-reservation-id="${reservation.id}">Edit</button>
                    <button class="deleteButton" data-reservation-id="${reservation.id}">Delete</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll(".deleteButton").forEach(button => {
            button.addEventListener("click", function () {
                const reservationId = this.getAttribute("data-reservation-id");
                console.log("Delete button clicked for reservation ID:", reservationId);
                if (reservationId) {
                    showDeleteConfirmation(reservationId);
                } else {
                    console.error("⚠️ Reservation ID not found.");
                }
            });
        });

        // Attach event listeners to edit buttons
        document.querySelectorAll(".editButton").forEach(button => {
            button.addEventListener("click", function () {
                const reservationId = this.getAttribute("data-reservation-id");
                console.log("Edit button clicked for reservation ID:", reservationId);
                if (reservationId) {
                    // Call showEditOverlay with reservation data
                    const reservation = reservations.find(res => res.id === reservationId);
                    if (reservation) {
                        showEditOverlay(reservation);
                    }
                } else {
                    console.error("⚠️ Reservation ID not found.");
                }
            });
        });
    }

    // Show the delete confirmation modal
    function showDeleteConfirmation(reservationId) {
        const reservation = reservations.find(res => res.id === reservationId);
        if (!reservation) {
            console.error("❌ Reservation not found.");
            return;
        }

        // Get modal elements
        const deleteModalOverlay = document.getElementById("deleteModal");
        const roomSpan = document.getElementById("deleteRoom");
        const seatSpan = document.getElementById("deleteSeat");
        const dateSpan = document.getElementById("deleteDate");
        const timeSpan = document.getElementById("deleteTime");
        const reservedBySpan = document.getElementById("deleteReservedBy");
        const confirmDeleteBtn = document.querySelector(".confirm-button");

        // Populate modal with reservation details
        roomSpan.textContent = reservation.roomNumber;
        seatSpan.textContent = reservation.seatNumber;
        dateSpan.textContent = formatDate(reservation.date);
        timeSpan.textContent = generateTimeSlot(reservation.time);
        reservedBySpan.textContent = reservation.reservedBy || "Unknown";

        // Show the modal
        deleteModalOverlay.style.visibility = "visible";
        deleteModalOverlay.style.opacity = "1";

        // Handle Confirm button click to delete the reservation
        confirmDeleteBtn.onclick = async function () {
            console.log("🗑️ Deleting reservation with ID:", reservationId);

            try {
                const response = await fetch(`/reservations/${reservationId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" }
                });

                if (response.ok) {
                    console.log("✅ Reservation deleted successfully.");

                    // Find and remove the row from the table after deletion
                    const rowToRemove = document.querySelector(`button[data-reservation-id="${reservationId}"]`).closest('tr');
                    if (rowToRemove) {
                        rowToRemove.remove();
                    }

                    closeDeleteModal();
                } else {
                    console.error("⚠️ Failed to delete reservation.");
                    alert("Failed to delete reservation. Please try again.");
                }
            } catch (error) {
                console.error("⚠️ Error deleting reservation:", error);
                alert("An error occurred. Please try again later.");
            }
        };
    }

    function showEditOverlay(reservation) {
        console.log("🛠 Editing Reservation:", reservation);
    
        // Get the edit overlay and elements
        const editOverlay = document.querySelector(".edit-overlay");
        const editDateInput = document.querySelector("#edit-date");
        const editTimeDropdown = document.querySelector("#edit-time");
        const editRoom = document.querySelector("#edit-room");
        const editSeat = document.querySelector("#edit-seat");
    
        // Display the overlay
        editOverlay.classList.add("active");
    
        // Set the form inputs to the current reservation details
        editDateInput.value = reservation.date;
        generateTimeOptions(editTimeDropdown, reservation.time);
    
        // Display room and seat info
        editRoom.innerText = `Room: ${reservation.roomNumber}`;
        editSeat.innerText = `Seat: ${reservation.seatNumber}`;
    
        // Handle save button click
        document.querySelector("#saveButton").onclick = async function () {
            const newDate = editDateInput.value;
            const newTime = editTimeDropdown.value;
    
            console.log("🔄 Sending update request for ID:", reservation.id);
    
            if (newTime === "00:00") {
                alert("🚫 Invalid time selection.");
                return;
            }
    
            try {
                const updateResponse = await fetch(`/update-reservation/${reservation.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        reserved_date: newDate,
                        time: newTime
                    })
                });
    
                console.log("🔄 Server Response:", updateResponse);
    
                if (updateResponse.ok) {
                    closeEditOverlay();
                    fetchReservations(); // Refresh the table
                } else {
                    const errorData = await updateResponse.json();
                    console.error("❌ Update Failed:", errorData);
                    alert("Failed to update reservation: " + (errorData.message || "Unknown error"));
                }
            } catch (error) {
                console.error("⚠️ Error updating reservation:", error);
                alert("Failed to update reservation due to a network error.");
            }
        };
    }    

    // Close the delete confirmation modal
    function closeDeleteModal() {
        const deleteModalOverlay = document.getElementById("deleteModal");
        deleteModalOverlay.style.visibility = "hidden";
        deleteModalOverlay.style.opacity = "0";
    }

    document.querySelector(".cancel-button").addEventListener("click", closeDeleteModal);
    document.querySelector(".close-button").addEventListener("click", closeDeleteModal);

    fetchReservations(); // Fetch data from database on page load
});
