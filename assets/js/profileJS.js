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

    // ========== MODAL ELEMENTS ==========
    var changePasswordModal = document.getElementById("changePasswordModal");
    var changePasswordBtn = document.getElementById("changePasswordBtn");
    var closeChangePasswordBtn = document.querySelector("#changePasswordModal .close-change-password");
    var submitPasswordBtn = document.querySelector(".change-submit-btn");

    // Ensure elements exist before proceeding
    if (!changePasswordModal || !changePasswordBtn || !closeChangePasswordBtn || !submitPasswordBtn) {
        console.error("One or more Change Password modal elements were not found in the DOM.");
        return;
    }

    // ====== HIDE MODAL INITIALLY ======
    changePasswordModal.style.display = "none"; // Force hiding at page load

    // ====== OPEN CHANGE PASSWORD MODAL ======
    changePasswordBtn.addEventListener("click", function () {
        console.log("Opening Change Password modal...");
        changePasswordModal.style.display = "flex"; // Show Change Password Modal
    });

    // ====== CLOSE MODAL ON BUTTON CLICK ======
    closeChangePasswordBtn.addEventListener("click", function () {
        console.log("Closing Change Password modal...");
        changePasswordModal.style.display = "none"; // Hide Change Password Modal
    });

    submitPasswordBtn.addEventListener("click", function () {
        console.log("Password changed successfully!");
        changePasswordModal.style.display = "none"; // Close modal after submission
    });

    // ====== CLOSE MODAL WHEN CLICKING OUTSIDE ======
    window.addEventListener("click", function (event) {
        if (event.target === changePasswordModal) {
            console.log("Clicked outside, closing modal...");
            changePasswordModal.style.display = "none"; // Hide Change Password Modal
        }
    });

});

document.addEventListener("DOMContentLoaded", function () {
    console.log("Script Loaded Successfully");

    // ========== MODAL ELEMENTS ==========
    var editProfileModal = document.getElementById("editProfileModal");
    var saveChangesModal = document.getElementById("saveChangesModal");
    var deleteAccountModal = document.getElementById("deleteAccountModal");
    var accountDeletedModal = document.getElementById("accountDeletedModal");
    var changePasswordModal = document.getElementById("changePasswordModal");
    var successChangesModal = document.getElementById("successChangesModal"); // New success message modal

    var editProfileBtn = document.getElementById("editProfileBtn");
    var deleteAccountBtn = document.getElementById("deleteAccountBtn");
    var changePasswordBtn = document.getElementById("changePasswordBtn");
    var saveChangesBtn = document.getElementById("saveChanges"); // Save Changes button

    var closeEditProfile = document.querySelector("#editProfileModal .close");
    var closeSaveChanges = document.querySelector("#saveChangesModal .close-confirm");
    var closeDeleteAccount = document.querySelector("#deleteAccountModal .close-confirm");

    var cancelBtn = document.getElementById("cancelBtn");
    var leaveBtn = document.getElementById("leaveBtn");

    var confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
    var cancelDeleteBtn = document.getElementById("cancelDeleteBtn");
    var goBackHomeBtn = document.getElementById("goBackHomeBtn");

    var closeChangePasswordBtn = document.querySelector("#changePasswordModal .close-change-password");
    var submitPasswordBtn = document.querySelector(".change-submit-btn");

    var closeSuccessChangesBtn = document.querySelector("#successChangesModal .close-success-changes"); // Close Success Changes Modal
    var goBackProfileBtn = document.querySelector("#goBackProfileBtn"); // Button to go back to profile from success modal

    // ========== HIDE ALL MODALS ON PAGE LOAD ==========
    var modals = [
        editProfileModal,
        saveChangesModal,
        deleteAccountModal,
        accountDeletedModal,
        changePasswordModal,
        successChangesModal // New success modal
    ];

    modals.forEach(function (modal) {
        if (modal) {
            modal.style.display = "none";
        }
    });

    // ========== SHOW & HIDE FUNCTIONS ==========
    function showModal(modal) {
        modal.style.display = "flex";
    }

    function hideModal(modal) {
        modal.style.display = "none";
    }

    // ========== OPEN MODALS ==========
    editProfileBtn.addEventListener("click", function () {
        showModal(editProfileModal);
    });

    deleteAccountBtn.addEventListener("click", function () {
        showModal(deleteAccountModal);
    });

    changePasswordBtn.addEventListener("click", function () {
        showModal(changePasswordModal);
    });

    saveChangesBtn.addEventListener("click", function () {
        hideModal(editProfileModal);
        showModal(successChangesModal); // Open success message modal
    });

    // ========== CLOSE MODALS ==========
    closeEditProfile.addEventListener("click", function () {
        showModal(saveChangesModal);
    });

    closeSaveChanges.addEventListener("click", function () {
        hideModal(saveChangesModal);
    });

    closeDeleteAccount.addEventListener("click", function () {
        hideModal(deleteAccountModal);
    });

    cancelBtn.addEventListener("click", function () {
        hideModal(saveChangesModal);
    });

    leaveBtn.addEventListener("click", function () {
        hideModal(editProfileModal);
        hideModal(saveChangesModal);
    });

    cancelDeleteBtn.addEventListener("click", function () {
        hideModal(deleteAccountModal);
    });

    confirmDeleteBtn.addEventListener("click", function () {
        hideModal(deleteAccountModal);
        showModal(accountDeletedModal);
    });

    goBackHomeBtn.addEventListener("click", function () {
        hideModal(accountDeletedModal);
        window.location.href = "index.html"; // Redirect to homepage
    });

    closeChangePasswordBtn.addEventListener("click", function () {
        hideModal(changePasswordModal); // Close Change Password, KEEP Edit Profile open
    });

    submitPasswordBtn.addEventListener("click", function () {
        console.log("Password changed successfully!");
        hideModal(changePasswordModal); // Close Change Password
        showModal(editProfileModal); // Return to Edit Profile
    });

    closeSuccessChangesBtn.addEventListener("click", function () {
        hideModal(successChangesModal);
        showModal(editProfileModal); // Return to profile
    });

    goBackProfileBtn.addEventListener("click", function () {
        hideModal(successChangesModal);
        showModal(editProfileModal); // Return to profile
    });

    // ========== CLOSE MODAL WHEN CLICKING OUTSIDE ==========
    window.addEventListener("click", function (event) {
        if (event.target === editProfileModal) {
            showModal(saveChangesModal);
        }
        if (event.target === saveChangesModal) {
            hideModal(saveChangesModal);
        }
        if (event.target === deleteAccountModal) {
            hideModal(deleteAccountModal);
        }
        if (event.target === accountDeletedModal) {
            hideModal(accountDeletedModal);
        }
        if (event.target === changePasswordModal) {
            hideModal(changePasswordModal);
        }
        if (event.target === successChangesModal) {
            hideModal(successChangesModal);
        }
    });

});










    



