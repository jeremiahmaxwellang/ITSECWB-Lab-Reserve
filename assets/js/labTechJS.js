function createPopup(id) {
  let popupNode = document.querySelector(id);

  if (!popupNode) {
    console.error(`Element with ID ${id} not found.`);
    return null;
  }

  let overlay = popupNode.querySelector(".overlay");
  let cancelButton = popupNode.querySelector(".cancelButton");
  let closeButton = popupNode.querySelector(".closeButton");

  function openPopup() {
    closeAllPopups(); // Ensure only one popup is open at a time
    popupNode.classList.add("active");
  }

  function closePopup() {
    popupNode.classList.remove("active");
  }

  if (overlay) overlay.addEventListener("click", closePopup);
  if (closeButton) closeButton.addEventListener("click", closePopup);
  if (cancelButton) cancelButton.addEventListener("click", closePopup);

  return { openPopup, closePopup };
}

// Function to close all popups before opening a new one
function closeAllPopups() {
  document.querySelectorAll(".popup.active").forEach(popup => {
    popup.classList.remove("active");
  });
}

// Create popups
let deletePopUp = createPopup("#deletePopUp");
let reservationDeletedPopup = createPopup("#reservationDeleted");

// Open delete confirmation popup on delete button click
if (deletePopUp) {
  document.querySelectorAll(".deleteButton").forEach(button => {
    button.addEventListener("click", deletePopUp.openPopup);
  });
}

// Click "Confirm" -> Close deletePopUp & Open reservationDeletedPopup
if (deletePopUp && reservationDeletedPopup) {
  let confirmButton = document.querySelector("#deletePopUp .confirmButton");
  if (confirmButton) {
    confirmButton.addEventListener("click", () => {
      deletePopUp.closePopup(); // Close Delete Confirmation popup
      reservationDeletedPopup.openPopup(); // Open Reservation Deleted popup
    });
  }
}

// Click "Home" -> Close all popups
if (reservationDeletedPopup) {
  let homeButton = document.querySelector("#reservationDeleted .homeButton");
  if (homeButton) {
    homeButton.addEventListener("click", closeAllPopups);
  }
}