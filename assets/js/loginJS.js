document.addEventListener("DOMContentLoaded", function() {
    const modal = document.getElementById("forgot-password-modal");
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const closeBtn = document.querySelector(".close");
    const backToLogin = document.getElementById("back-to-login");

    // Ensure the modal is always hidden when the page loads
    modal.style.display = "none";

    // Show modal when "Forgot Password?" is clicked
    forgotPasswordLink.addEventListener("click", function(event) {
        event.preventDefault();
        modal.style.display = "flex";
    });

    // Hide modal when close button (X) is clicked
    closeBtn.addEventListener("click", function() {
        modal.style.display = "none";
    });

    // Hide modal when "Back to Login" is clicked
    backToLogin.addEventListener("click", function(event) {
        event.preventDefault();
        modal.style.display = "none";
    });

    // Hide modal when clicking outside the modal content
    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
