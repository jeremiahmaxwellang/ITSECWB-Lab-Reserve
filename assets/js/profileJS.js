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
        return;
    }

    // Ensure modal starts as hidden
    modal.style.display = "none";

    // Open Modal when clicking "Edit Profile"
    btn.addEventListener("click", function () {
        console.log("Edit Profile button clicked");
        modal.style.display = "flex"; // Make modal visible & centered
    });

    // Close Modal when 'X' is clicked
    closeBtn.addEventListener("click", function () {
        console.log("Close button clicked");
        modal.style.display = "none";
    });

    // Close Modal when clicking outside the modal-content
    window.addEventListener("click", function (event) {
        if (event.target === modal) {
            console.log("Clicked outside modal, closing...");
            modal.style.display = "none";
        }
    });

    // Save Changes button should close the modal
    saveChangesBtn.addEventListener("click", function () {
        console.log("Save Changes button clicked");
        modal.style.display = "none"; // Closes modal
    });

    // Delete Account button redirects to login
    deleteAccountBtn.addEventListener("click", function () {
        console.log("Delete Account button clicked");
        window.location.href = "login.html"; // Redirect to login page
    });

    // Change Password button redirects to login
    changePasswordBtn.addEventListener("click", function () {
        console.log("Change Password button clicked");
        window.location.href = "login.html"; // Redirect to login page
    });
});
