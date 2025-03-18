document.addEventListener("DOMContentLoaded", function () {
    console.log("📌 Dashboard script loaded successfully.");

    const currentTableBody = document.querySelector("#currentReservationsTable tbody");
    const editDateInput = document.querySelector("#edit-date");
    const editTimeDropdown = document.querySelector("#edit-time");

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

        return `${format12HourTime(startTime)} - ${format12HourTime(endTime)}`; // ✅ Table format 12-hour time
    }

    function format12HourTime(date) {
        let hours = date.getHours();
        let minutes = String(date.getMinutes()).padStart(2, "0");
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12; // Convert 0 to 12
        return `${hours}:${minutes} ${ampm}`;
    }

    function format24HourTime(date) {
        let hours = String(date.getHours()).padStart(2, "0");
        let minutes = String(date.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
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

                const today = new Date().toISOString().split('T')[0];

                const futureReservations = data.filter(reservation => {
                    const reservationDate = new Date(reservation.date).toISOString().split('T')[0];
                    return reservationDate >= today;
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
                    row.insertCell(3).innerText = formatTimeSlot(reservation.time); // ✅ Table uses 12-hour time

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
        console.log("🛠 Editing Reservation:", reservation);

        document.querySelector(".edit-overlay").classList.add("active");

        editDateInput.value = reservation.date;

        // ✅ Automatically update time options
        generateTimeOptions();

        document.querySelector("#edit-room").innerText = `Room: ${reservation.roomNumber}`;
        document.querySelector("#edit-seat").innerText = `Seat: ${reservation.seatNumber}`;

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

    function generateTimeOptions() {
        editTimeDropdown.innerHTML = ""; // Clear previous options

        console.log("🔧 Running generateTimeOptions()");

        for (let hour = 8; hour < 19; hour++) {
            for (let minute of [0, 30]) {
                let startTime = `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
                let endTime = new Date();
                endTime.setHours(hour);
                endTime.setMinutes(minute + 30);

                let timeLabel = `${startTime} - ${format24HourTime(endTime)}`; // ✅ Dropdown remains in 24-hour time

                let option = document.createElement("option");
                option.value = startTime;
                option.textContent = timeLabel;

                editTimeDropdown.appendChild(option);
            }
        }
    }

    editDateInput.addEventListener("change", function () {
        const today = new Date().toISOString().split("T")[0];

        if (this.value < today) {
            alert("🚫 You cannot select past dates.");
            this.value = today;
        } else {
            generateTimeOptions();
        }
    });

    fetchUserReservations();
});
