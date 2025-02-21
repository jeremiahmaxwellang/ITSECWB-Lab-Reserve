document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded Successfully");

    var modal = document.getElementById("editProfileModal");
    var btn = document.getElementById("editProfileBtn");
    var closeBtn = modal ? modal.querySelector(".close") : null;
    var saveChangesBtn = document.getElementById("saveChanges");
    var deleteAccountBtn = document.getElementById("deleteAccountBtn");
    var changePasswordBtn = document.getElementById("changePasswordBtn");

    if (!modal || !btn || !closeBtn || !saveChangesBtn || !deleteAccountBtn || !changePasswordBtn) {
        console.error("One or more modal elements were not found in the DOM.");
    } else {
        modal.style.display = "none";

        btn.addEventListener("click", function () {
            console.log("Edit Profile button clicked");
            modal.style.display = "flex";
        });

        closeBtn.addEventListener("click", function () {
            console.log("Close button clicked");
            modal.style.display = "none";
        });

        window.addEventListener("click", function (event) {
            if (event.target === modal) {
                console.log("Clicked outside modal, closing...");
                modal.style.display = "none";
            }
        });

        saveChangesBtn.addEventListener("click", function () {
            console.log("Save Changes button clicked");
            modal.style.display = "none";
        });

        deleteAccountBtn.addEventListener("click", function () {
            console.log("Delete Account button clicked");
            window.location.href = "login.html";
        });

        changePasswordBtn.addEventListener("click", function () {
            console.log("Change Password button clicked");
            window.location.href = "login.html";
        });
    }

    // ========== Reservation Table Population ==========
    const currentTableBody = document.querySelector('#currentReservationsTable tbody');
    const recentTableBody = document.querySelector('#recentReservationsTable tbody');

    if (!currentTableBody || !recentTableBody) {
        console.error("Table body elements not found in DOM.");
        return;
    }

    // Function to generate time slots in 30-minute intervals
    function generateTimeSlots(startTime, endTime) {
        let slots = [];
        let current = new Date();
        current.setHours(startTime, 0, 0, 0); // Set start time
        let end = new Date();
        end.setHours(endTime, 0, 0, 0); // Set end time

        while (current < end) {
            let next = new Date(current);
            next.setMinutes(current.getMinutes() + 30);

            let startTimeStr = formatTime(current);
            let endTimeStr = formatTime(next);
            slots.push(`${startTimeStr} - ${endTimeStr}`);

            current = next;
        }
        return slots;
    }

    // Helper function to format time (8:00 AM - 8:30 AM)
    function formatTime(date) {
        let hours = date.getHours();
        let minutes = date.getMinutes();
        let ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    const currentReservations = [
        { roomNumber: 'GK01', seatNumber: 'Seat #01', date: 'August 5, 2025', timeSlot: '8:00 AM - 8:30 AM' },
        { roomNumber: 'GK02', seatNumber: 'Seat #02', date: 'August 6, 2025', timeSlot: '9:30 AM - 10:00 AM' },
        { roomNumber: 'GK03', seatNumber: 'Seat #03', date: 'August 7, 2025', timeSlot: '11:00 AM - 11:30 AM' },
        { roomNumber: 'GK04', seatNumber: 'Seat #04', date: 'August 8, 2025', timeSlot: '2:30 PM - 3:00 PM' }
    ];

    const recentReservations = [
        { roomNumber: 'GK01', seatNumber: 'Seat #01', date: 'August 1, 2025', timeSlot: '8:30 AM - 9:00 AM', reservedBy: 'John Reservation' },
        { roomNumber: 'GK02', seatNumber: 'Seat #02', date: 'August 2, 2025', timeSlot: '10:30 AM - 11:00 AM', reservedBy: 'Jane Doe' },
        { roomNumber: 'GK03', seatNumber: 'Seat #03', date: 'August 3, 2025', timeSlot: '1:00 PM - 1:30 PM', reservedBy: 'Alice Smith' },
        { roomNumber: 'GK04', seatNumber: 'Seat #04', date: 'August 4, 2025', timeSlot: '4:00 PM - 4:30 PM', reservedBy: 'Bob Johnson' }
    ];

    function populateTable(data, tableBody, isCurrent) {
        tableBody.innerHTML = '';

        data.forEach(reservation => {
            const row = tableBody.insertRow();
            row.insertCell(0).innerText = reservation.roomNumber;
            row.insertCell(1).innerText = reservation.seatNumber;
            row.insertCell(2).innerText = reservation.date;
            row.insertCell(3).innerText = reservation.timeSlot;

            if (isCurrent) {
                const editCell = row.insertCell(4);
                const editButton = document.createElement('button');
                editButton.className = 'edit-button';
                editButton.innerText = 'Edit';
                editButton.onclick = function () {
                    window.location.href = 'Reservation.html';
                };
                editCell.appendChild(editButton);
            } else {
                row.insertCell(4).innerText = reservation.reservedBy;
            }
        });
    }

    // Populate tables dynamically
    populateTable(currentReservations, currentTableBody, true);
    populateTable(recentReservations, recentTableBody, false);
});

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded Successfully");

    // Get modal elements
    var editProfileModal = document.getElementById("editProfileModal");
    var editProfileBtn = document.getElementById("editProfileBtn");
    var closeBtn = document.querySelector("#editProfileModal .close");
    
    var saveChangesModal = document.getElementById("saveChangesModal"); // Unsaved Changes Modal
    var closeConfirmBtn = document.querySelector("#saveChangesModal .close-confirm");
    var cancelBtn = document.getElementById("cancelBtn"); // "Cancel" button
    var leaveBtn = document.getElementById("leaveBtn"); // "Leave" button

    // Ensure all elements exist before proceeding
    if (!editProfileModal || !editProfileBtn || !closeBtn || !saveChangesModal || !closeConfirmBtn || !cancelBtn || !leaveBtn) {
        console.error("One or more modal elements were not found in the DOM.");
        return;
    }

    // Initially hide the modals
    editProfileModal.style.display = "none";
    saveChangesModal.style.display = "none";

    // Open Edit Profile Modal
    editProfileBtn.addEventListener("click", function () {
        editProfileModal.style.display = "flex";
    });

    closeBtn.addEventListener("click", function () {
        editProfileModal.style.display = "none"; // Hide Edit Profile Modal
        saveChangesModal.style.display = "flex"; // Show Unsaved Changes Modal
    });

    closeConfirmBtn.addEventListener("click", function () {
        saveChangesModal.style.display = "none";
    });

    // Clicking "Cancel" -> Go back to Edit Profile Modal
    cancelBtn.addEventListener("click", function () {
        saveChangesModal.style.display = "none"; // Hide Unsaved Changes Modal
        editProfileModal.style.display = "flex"; // Reopen Edit Profile Modal
    });

    // Clicking "Leave" -> Hide everything
    leaveBtn.addEventListener("click", function () {
        saveChangesModal.style.display = "none"; // Hide Unsaved Changes Modal
    });

    // Close Edit Profile Modal when clicking outside of it, but show Unsaved Changes Modal instead
    window.addEventListener("click", function (event) {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = "none";
            saveChangesModal.style.display = "flex";
        } else if (event.target === saveChangesModal) {
            saveChangesModal.style.display = "none";
        }
    });
});




    



