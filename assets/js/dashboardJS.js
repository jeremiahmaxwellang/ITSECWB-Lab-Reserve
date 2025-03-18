document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Dashboard script loaded successfully.");

    const currentTableBody = document.querySelector("#currentReservationsTable tbody");

    if (!currentTableBody) {
        console.error("❌ Current reservations table not found.");
        return;
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

    function formatTimeSlot(timeString) {
        if (!timeString) return "";
        
        const [hour, minute] = timeString.split(":").map(Number);
        const startTime = new Date();
        startTime.setHours(hour, minute, 0, 0);

        const endTime = new Date(startTime);
        endTime.setMinutes(startTime.getMinutes() + 30);

        return `${startTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        })} - ${endTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        })}`;
    }

    function fetchUserReservations() {
        console.log("🔄 Fetching user reservations...");

        fetch("/my-reservations")
            .then(response => response.json())
            .then(data => {
                console.log("📥 Reservations received from server:", data);

                currentTableBody.innerHTML = "";
                if (data.length === 0) {
                    currentTableBody.innerHTML = `<tr><td colspan="5">No reservations found.</td></tr>`;
                    return;
                }

                // Get today's date
                const today = new Date().toISOString().split('T')[0]; // Format as YYYY-MM-DD

                // Filter out past reservations
                const futureReservations = data.filter(reservation => {
                    const reservationDate = new Date(reservation.date).toISOString().split('T')[0];
                    return reservationDate >= today; // Only include future or today’s reservations
                });

                if (futureReservations.length === 0) {
                    currentTableBody.innerHTML = `<tr><td colspan="5">No upcoming reservations.</td></tr>`;
                    return;
                }

                futureReservations.forEach(reservation => {
                    console.log(`📝 Processing reservation:`, reservation);

                    const row = currentTableBody.insertRow();
                    row.insertCell(0).innerText = reservation.roomNumber;
                    row.insertCell(1).innerText = reservation.seatNumber;
                    row.insertCell(2).innerText = formatDate(reservation.date);
                    row.insertCell(3).innerText = formatTimeSlot(reservation.time);
                    
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

    function showEditOverlay(reservation) {
        document.querySelector(".edit-overlay").classList.add("active");

        document.querySelector("#edit-date").value = reservation.date;
        document.querySelector("#edit-time").innerHTML = generateTimeOptions(reservation.time);
        
        document.querySelector("#edit-room").innerText = `Room: ${reservation.roomNumber}`;
        document.querySelector("#edit-seat").innerText = `Seat: ${reservation.seatNumber}`;

        document.querySelector("#saveButton").onclick = async function () {
            const newDate = document.querySelector("#edit-date").value;
            const newTime = document.querySelector("#edit-time").value;

            console.log("🔄 Sending update request for ID:", reservation.id);
            
            try {
                const updateResponse = await fetch(`/update-reservation/${reservation.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        reserved_date: newDate,
                        time: newTime.split(" - ")[0] // Fix: Store only the start time
                    })
                });

                console.log("🔄 Server Response:", updateResponse);

                if (updateResponse.ok) {
                    closeEditOverlay();
                    fetchUserReservations();
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

    function closeEditOverlay() {
        document.querySelector(".edit-overlay").classList.remove("active");
    }

    document.querySelector("#cancelButton").addEventListener("click", closeEditOverlay);

    function generateTimeOptions(selectedTime) {
        let options = "";
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

                let timeValue = `${startHour}:${startMinute} - ${formattedEndHour}:${formattedEndMinute}`;
                let selected = timeValue === formatTimeSlot(selectedTime) ? "selected" : "";

                options += `<option value="${timeValue}" ${selected}>${timeValue}</option>`;
            }
        }
        return options;
    }

    fetchUserReservations();
});