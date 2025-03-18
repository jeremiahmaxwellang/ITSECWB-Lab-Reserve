class ModalHandler {
    constructor(modalId, closeBtnId) {
        this.modal = document.getElementById(modalId);
        this.closeBtn = document.getElementById(closeBtnId);

        if (!this.modal) {
            console.error(`Modal with ID '${modalId}' not found.`);
            return;
        }

        this.modal.style.display = "none"; // Hide on load

        // Close modal when clicking the close button
        if (this.closeBtn) {
            this.closeBtn.addEventListener("click", () => this.close());
        }

        // Prevent clicking inside the modal from closing it
        this.modal.querySelector(".modal-content").addEventListener("click", (event) => {
            event.stopPropagation();
        });

        // Close modal when clicking outside of it
        this.modal.addEventListener("click", (event) => {
            if (event.target === this.modal) {
                this.close();
            }
        });
    }

    open() {
        if (this.modal) {
            console.log(`Opening modal: ${this.modal.id}`);
            this.modal.style.display = "flex";
        }
    }

    close() {
        if (this.modal) {
            console.log(`Closing modal: ${this.modal.id}`);
            this.modal.style.display = "none";
        }
    }
}

// Instantiate modals
const forgotPasswordModal = new ModalHandler("forgot-password-modal", "close-forgot");
const otpModal = new ModalHandler("otp-modal", "close-otp");
const changePasswordModal = new ModalHandler("change-password-modal", "close-change-password");

// Ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const forgotSubmitBtn = document.getElementById("forgot-submit");
    const otpConfirmBtn = document.querySelector(".otp-submit-btn");
    const backToLogin = document.getElementById("back-to-login");
    const closeChangePasswordBtn = document.querySelector(".close-change-password");
    const changePasswordSubmitBtn = document.querySelector(".change-submit-btn"); // Selects Submit button

    // Open Forgot Password Modal
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function (event) {
            event.preventDefault();
            forgotPasswordModal.open();
        });
    }

    // Back to Login closes Forgot Password Modal
    if (backToLogin) {
        backToLogin.addEventListener("click", function (event) {
            event.preventDefault();
            forgotPasswordModal.close();
        });
    }

    // Clicking "Submit" closes Forgot Password Modal and opens OTP Modal
    if (forgotSubmitBtn) {
        forgotSubmitBtn.addEventListener("click", function (event) {
            event.preventDefault();
            forgotPasswordModal.close();

            // Delay to prevent accidental closure
            setTimeout(() => {
                otpModal.open();
            }, 200);
        });
    }

    // Clicking "Confirm" on OTP Modal closes OTP and opens Change Password Modal
    if (otpConfirmBtn) {
        otpConfirmBtn.addEventListener("click", function (event) {
            event.preventDefault();
            otpModal.close();

            // Delay to prevent accidental closure
            setTimeout(() => {
                changePasswordModal.open();
            }, 200);
        });
    }

    // Close Change Password Modal
    if (closeChangePasswordBtn) {
        closeChangePasswordBtn.addEventListener("click", function () {
            console.log("Closing Change Password Modal");
            changePasswordModal.close();
        });
    }

    // Redirect to dashboard.html when Submit is clicked on Change Password Modal
    if (changePasswordSubmitBtn) {
        changePasswordSubmitBtn.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Redirecting to Dashboard...");
            window.location.href = '/dashboard'; // Redirects to dashboard.html
        });
    }
});

