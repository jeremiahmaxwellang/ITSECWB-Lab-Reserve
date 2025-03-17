document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Dashboard script loaded successfully.");

    const currentTableBody = document.querySelector("#currentReservationsTable tbody");

    if (!currentTableBody) {
        console.error("❌ Current reservations table not found.");
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

    // Fetch reservations of the logged-in student
    function fetchUserReservations() {
        console.log("🔄 Fetching user reservations...");
        
        fetch("/my-reservations")
            .then(response => {
                if (!response.ok) {
                    console.error("❌ Failed to fetch reservations.");
                    return [];
                }
                return response.json();
            })
            .then(data => {
                console.log("📥 Reservations received from server:", data);
                
                currentTableBody.innerHTML = ""; // Clear existing rows

                if (data.length === 0) {
                    console.warn("⚠️ No reservations found.");
                    currentTableBody.innerHTML = `<tr><td colspan="5">No reservations found.</td></tr>`;
                    return;
                }

                data.forEach((reservation, index) => {
                    console.log(`📝 Processing reservation ${index + 1}:`, reservation);
                    
                    const row = currentTableBody.insertRow();
                    row.insertCell(0).innerText = reservation.roomNumber;
                    row.insertCell(1).innerText = reservation.seatNumber;
                    row.insertCell(2).innerText = formatDate(reservation.date);
                    row.insertCell(3).innerText = formatTime(reservation.time);

                    // Add Edit button
                    const editCell = row.insertCell(4);
                    const editButton = document.createElement("button");
                    editButton.className = "edit-button";
                    editButton.innerText = "Edit";
                    editButton.onclick = function () {
                        // Redirect to reservation edit page (or modal logic)
                        window.location.href = `/edit-reservation?id=${reservation.id}`;
                    };
                    editCell.appendChild(editButton);
                });

                console.log("✅ Reservations successfully displayed.");
            })
            .catch(error => {
                console.error("⚠️ Error fetching reservations:", error);
            });
    }

    // Fetch reservations on page load
    fetchUserReservations();
});