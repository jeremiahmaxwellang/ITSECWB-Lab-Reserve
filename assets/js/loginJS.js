document.addEventListener("DOMContentLoaded", function () {
    // Select modal elements
    const forgotModal = document.getElementById("forgot-password-modal");
    const otpModal = document.getElementById("otp-modal");

    // Select buttons and links
    const forgotPasswordLink = document.getElementById("forgot-password-link");
    const forgotSubmitBtn = document.getElementById("forgot-submit");
    const closeForgotBtn = document.getElementById("close-forgot");
    const closeOtpBtn = document.getElementById("close-otp");
    const backToLogin = document.getElementById("back-to-login");

    // Hide modals on page load
    if (forgotModal) forgotModal.style.display = "none";
    if (otpModal) otpModal.style.display = "none";

    // Function to open a modal
    function openModal(modal) {
        if (modal) {
            modal.style.display = "flex";
        }
    }

    // Function to close a modal
    function closeModal(modal) {
        if (modal) {
            modal.style.display = "none";
        }
    }

    // Open Forgot Password Modal
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Opening Forgot Password modal");
            openModal(forgotModal);
        });
    }

    // Close Forgot Password Modal
    if (closeForgotBtn) {
        closeForgotBtn.addEventListener("click", function () {
            console.log("Closing Forgot Password modal");
            closeModal(forgotModal);
        });
    }

    // Close OTP Modal
    if (closeOtpBtn) {
        closeOtpBtn.addEventListener("click", function () {
            console.log("Closing OTP modal");
            closeModal(otpModal);
        });
    }

    // Click "Submit" -> Close Forgot Modal & Open OTP Modal
    if (forgotSubmitBtn) {
        forgotSubmitBtn.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Submitting Forgot Password, opening OTP modal");
            closeModal(forgotModal);

            // Delay opening OTP modal slightly to prevent accidental closure
            setTimeout(() => {
                openModal(otpModal);
            }, 200);
        });
    }

    // Click "Back to Login" -> Close Forgot Password Modal
    if (backToLogin) {
        backToLogin.addEventListener("click", function (event) {
            event.preventDefault();
            console.log("Going back to login, closing Forgot Password modal");
            closeModal(forgotModal);
        });
    }

    // FIX: Prevent closing modal when clicking inside
    document.addEventListener("click", function (event) {
        if (forgotModal.style.display === "flex") {
            if (!forgotModal.querySelector(".modal-content").contains(event.target) && event.target !== forgotPasswordLink) {
                console.log("Click outside modal, closing Forgot Password modal");
                closeModal(forgotModal);
            }
        }
        if (otpModal.style.display === "flex") {
            if (!otpModal.querySelector(".modal-content").contains(event.target)) {
                console.log("Click outside modal, closing OTP modal");
                closeModal(otpModal);
            }
        }
    });
});
