document.addEventListener("DOMContentLoaded", function () {

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

    // ====== MODAL ELEMENTS ======
    var editProfileModal = document.getElementById("editProfileModal");
    var editProfileBtn = document.getElementById("editProfileBtn");
    var closeEditProfileBtn = document.querySelector("#editProfileModal .close");

    var saveChangesModal = document.getElementById("saveChangesModal");
    var closeConfirmBtn = document.querySelector("#saveChangesModal .close-confirm");
    var cancelBtn = document.getElementById("cancelBtn");
    var leaveBtn = document.getElementById("leaveBtn");

    var deleteAccountModal = document.getElementById("deleteAccountModal");
    var deleteAccountBtn = document.getElementById("deleteAccountBtn");
    var closeDeleteConfirmBtn = document.querySelector("#deleteAccountModal .close-confirm");
    var cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    var confirmDeleteBtn = document.getElementById("confirmDeleteBtn");

    var accountDeletedModal = document.getElementById("accountDeletedModal");
    var goBackHomeBtn = document.getElementById("goBackHomeBtn");

    var changePasswordModal = document.getElementById("changePasswordModal");
    var changePasswordBtn = document.getElementById("changePasswordBtn");
    var closeChangePasswordBtn = document.querySelector("#changePasswordModal .close-change-password");
    var submitPasswordBtn = document.querySelector(".change-submit-btn");

    // Ensure all elements exist before proceeding
    if (!editProfileModal || !editProfileBtn || !closeEditProfileBtn ||
        !saveChangesModal || !closeConfirmBtn || !cancelBtn || !leaveBtn ||
        !deleteAccountModal || !deleteAccountBtn || !closeDeleteConfirmBtn || !cancelDeleteBtn || !confirmDeleteBtn ||
        !accountDeletedModal || !goBackHomeBtn || !changePasswordModal || !changePasswordBtn || !closeChangePasswordBtn || !submitPasswordBtn) {
        console.error("One or more modal elements were not found in the DOM.");
        return;
    }

    // Initially hide all modals
    editProfileModal.style.display = "none";
    saveChangesModal.style.display = "none";
    deleteAccountModal.style.display = "none";
    accountDeletedModal.style.display = "none";
    changePasswordModal.style.display = "none";

    // ====== Open & Close Edit Profile Modal ======
    editProfileBtn.addEventListener("click", function () {
        editProfileModal.style.display = "flex";
    });

    closeEditProfileBtn.addEventListener("click", function () {
        editProfileModal.style.display = "none"; // Hide Edit Profile Modal
        saveChangesModal.style.display = "flex"; // Show Unsaved C  hanges Modal
    });

    // ====== Open & Close Unsaved Changes Modal ======
    closeConfirmBtn.addEventListener("click", function () {
        saveChangesModal.style.display = "none";
    });

    cancelBtn.addEventListener("click", function () {
        saveChangesModal.style.display = "none"; // Hide Unsaved Changes Modal
        editProfileModal.style.display = "flex"; // Reopen Edit Profile Modal
    });

    leaveBtn.addEventListener("click", function () {
        saveChangesModal.style.display = "none"; // Hide Unsaved Changes Modal
    });

    // ====== Open & Close Delete Account Modal ======
    deleteAccountBtn.addEventListener("click", function () {
        deleteAccountModal.style.display = "flex";
    });

    closeDeleteConfirmBtn.addEventListener("click", function () {
        deleteAccountModal.style.display = "none";
    });

    cancelDeleteBtn.addEventListener("click", function () {
        deleteAccountModal.style.display = "none";
    });

    confirmDeleteBtn.addEventListener("click", function () {
        deleteAccountModal.style.display = "none"; // Hide Delete Account Modal
        accountDeletedModal.style.display = "flex"; // Show Account Deleted Modal
    });

    goBackHomeBtn.addEventListener("click", function () {
        window.location.href = "index.html";
    });

    // ====== Open & Close Change Password Modal ======
    changePasswordBtn.addEventListener("click", function () {
        console.log("Change Password button clicked");
        changePasswordModal.style.display = "flex"; // Open Change Password Modal
    });

    closeChangePasswordBtn.addEventListener("click", function () {
        console.log("Closing Change Password modal...");
        changePasswordModal.style.display = "none"; // Close Change Password Modal
    });

    submitPasswordBtn.addEventListener("click", function () {
        console.log("Password changed successfully!");
        changePasswordModal.style.display = "none"; // Close modal on successful submission
    });

    // Close modals when clicking outside of them
    window.addEventListener("click", function (event) {
        if (event.target === editProfileModal) {
            editProfileModal.style.display = "none";
            saveChangesModal.style.display = "flex";
        } else if (event.target === saveChangesModal) {
            saveChangesModal.style.display = "none";
        } else if (event.target === deleteAccountModal) {
            deleteAccountModal.style.display = "none";
        } else if (event.target === accountDeletedModal) {
            accountDeletedModal.style.display = "none";
        } else if (event.target === changePasswordModal) {
            changePasswordModal.style.display = "none";
        }
    });
});







    



