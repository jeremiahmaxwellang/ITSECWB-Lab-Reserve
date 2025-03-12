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

        tableBody.innerHTML = ""; // ✅ Clear old table data

        reservations.forEach((reservation, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${reservation.roomNumber}</td>
                <td>${reservation.seatNumber}</td>
                <td>${formatDate(reservation.date)}</td>
                <td>${generateTimeSlot(reservation.time)}</td>
                <td>${reservation.reservedBy || "⚠️ Unknown"}</td>
                <td class="button-container">
                    <button class="editButton">Edit</button>
                    <button class="deleteButton" data-reservation-id="${reservation.id}">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });

        // Attach event listeners to delete buttons
        document.querySelectorAll(".deleteButton").forEach(button => {
            button.addEventListener("click", function () {
                const reservationId = this.getAttribute("data-reservation-id");
                // Log the click event with reservation ID
                console.log("Delete button clicked for reservation ID:", reservationId);
                if (reservationId) {
                    showDeleteConfirmation(reservationId);
                } else {
                    console.error("⚠️ Reservation ID not found.");
                }
            });
        });
    }

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
    
        // ✅ Show the modal
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
                    fetchReservations(); // Refresh table after deletion
                    closeDeleteModal();
                } else {
                    console.error("⚠️ Failed to delete reservation.");
                }
            } catch (error) {
                console.error("⚠️ Error deleting reservation:", error);
            }
        };
    
        // Close modal on cancel or close button click
        document.querySelector(".cancel-button").addEventListener("click", closeDeleteModal);
        document.querySelector(".close-button").addEventListener("click", closeDeleteModal);
    }
    
    // ✅ Function to close the modal
    function closeDeleteModal() {
        const deleteModalOverlay = document.getElementById("deleteModal");
        deleteModalOverlay.style.visibility = "hidden";
        deleteModalOverlay.style.opacity = "0";
    }    

    fetchReservations(); // Fetch data from database on page load
}); 