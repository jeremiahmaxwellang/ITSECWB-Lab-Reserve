document.addEventListener('DOMContentLoaded', async function () {
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
                    <button class="deleteButton" onclick="showDeleteConfirmation(${index})">Delete</button>
                </td>
            `;
    
            tableBody.appendChild(row);
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
        document.querySelector(".confirm-button").onclick = async function () {
            await deleteReservation(reservations[index].id);
            fetchReservations(); // Refresh table
            deleteModal.classList.remove("active");
        };
    }

    async function deleteReservation(reservationId) {
        try {
            const response = await fetch(`/reservations/${reservationId}`, { method: "DELETE" });
            if (!response.ok) {
                throw new Error("Failed to delete reservation");
            }
            console.log("Reservation deleted successfully");
        } catch (error) {
            console.error("Error deleting reservation:", error);
        }
    }

    // Close modal on cancel or overlay click
    document.querySelector(".cancel-button").addEventListener("click", function () {
        document.getElementById("deleteModal").classList.remove("active");
    });

    document.querySelector(".close-button").addEventListener("click", function () {
        document.getElementById("deleteModal").classList.remove("active");
    });

    fetchReservations(); // Fetch data from database on page load
});
