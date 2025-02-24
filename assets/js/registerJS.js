class ModalHandler {
    constructor(modalId, closeBtnId = null) {
        this.modal = document.getElementById(modalId);
        this.closeBtn = closeBtnId ? document.getElementById(closeBtnId) : null;

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

// Initialize success modal
const successModal = new ModalHandler("successModal");

// Ensure elements exist before adding event listeners
document.addEventListener("DOMContentLoaded", function () {
    const createAccountButton = document.querySelector(".create-button");
    const getStartedButton = document.getElementById("getStartedButton");

    if (createAccountButton) {
        createAccountButton.addEventListener("click", function () {
            successModal.open();
        });
    }

    if (getStartedButton) {
        getStartedButton.addEventListener("click", function () {
            successModal.close();
                window.location.href = "/login"; // Redirect to login page
        });
    }
});
