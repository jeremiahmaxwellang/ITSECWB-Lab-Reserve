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
                        showEditOverlay(reservation);
                    };
                    editCell.appendChild(editButton);
                });

                console.log("✅ Reservations successfully displayed.");
            })
            .catch(error => {
                console.error("⚠️ Error fetching reservations:", error);
            });
    }

    // Add these new functions for edit functionality
    function showEditOverlay(reservation) {
        // Create overlay elements
        const overlay = document.createElement("div");
        overlay.className = "edit-overlay";
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1000;
        `;

        const editForm = document.createElement("div");
        editForm.className = "edit-form";
        editForm.style.cssText = `
            background-color: #1F2937;
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            color: white;
        `;

        // Create form content
        editForm.innerHTML = `
            <h2 style="font-size: 1.5rem; margin-bottom: 1.5rem;">Edit Reservation</h2>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem;">Date:</label>
                <input type="date" id="editDate" 
                       min="${new Date().toISOString().split('T')[0]}"
                       value="${reservation.date}"
                       style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;">
            </div>
            <div class="form-group" style="margin-bottom: 1rem;">
                <label style="display: block; margin-bottom: 0.5rem;">Time:</label>
                <select id="editTime" style="width: 100%; padding: 0.5rem; border-radius: 4px; border: 1px solid #ccc;">
                    ${generateTimeOptions(reservation.time)}
                </select>
            </div>
            <div class="reservation-details" style="margin: 1rem 0; padding: 1rem; background-color: #374151; border-radius: 4px;">
                <p>Room: ${reservation.roomNumber}</p>
                <p>Seat: ${reservation.seatNumber}</p>
            </div>
            <div class="button-group" style="display: flex; gap: 1rem; margin-top: 1.5rem;">
                <button id="saveButton" style="padding: 0.5rem 1rem; background-color: #10B981; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Save Changes
                </button>
                <button id="cancelButton" style="padding: 0.5rem 1rem; background-color: #EF4444; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Cancel
                </button>
            </div>
        `;

        // Add event listeners
        overlay.appendChild(editForm);
        document.body.appendChild(overlay);

        // Save button click handler
        document.getElementById("saveButton").addEventListener("click", async () => {
            const newDate = document.getElementById("editDate").value;
            const newTime = document.getElementById("editTime").value;

            // Check for conflicts
            const response = await fetch("/check-reservation-conflict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    reservationId: reservation.id,
                    date: newDate,
                    time: newTime,
                    roomNumber: reservation.roomNumber,
                    seatNumber: reservation.seatNumber.replace("Seat #", "")
                })
            });

            const result = await response.json();

            if (result.conflict) {
                alert("This seat is already reserved for the selected time.");
                return;
            }

            // Update the reservation
            try {
                const updateResponse = await fetch(`/update-reservation/${reservation.id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        reserved_date: newDate,
                        time: newTime
                    })
                });

                if (updateResponse.ok) {
                    document.body.removeChild(overlay);
                    fetchUserReservations(); // Refresh the table
                } else {
                    alert("Failed to update reservation");
                }
            } catch (error) {
                console.error("Error updating reservation:", error);
                alert("Failed to update reservation");
            }
        });

        // Cancel button click handler
        document.getElementById("cancelButton").addEventListener("click", () => {
            document.body.removeChild(overlay);
        });
    }

    function generateTimeOptions(selectedTime) {
        let options = '';
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
                let formattedEndHour = String(endHour).padStart(2, "0");
                let formattedEndMinute = String(endMinute).padStart(2, "0");
                
                let timeValue = `${startHour}:${startMinute}`;
                let displayText = `${startHour}:${startMinute} - ${formattedEndHour}:${formattedEndMinute}`;
                
                options += `<option value="${timeValue}" ${timeValue === selectedTime ? 'selected' : ''}>${displayText}</option>`;
            }
        }
        return options;
    }

    // Fetch reservations on page load
    fetchUserReservations();
});