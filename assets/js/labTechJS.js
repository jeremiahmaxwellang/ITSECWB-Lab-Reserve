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

// Create popups
let deletePopUp = createPopup("#deletePopUp");
let reservationDeletedPopup = createPopup("#reservationDeleted");

// Open delete confirmation popup on delete button click
if (deletePopUp) {
  document.querySelectorAll(".deleteButton").forEach(button => {
    button.addEventListener("click", deletePopUp.openPopup);
  });

  // When Confirm is clicked, open reservationDeleted popup WITHOUT closing deletePopUp
  let confirmButton = document.querySelector("#deletePopUp .confirmButton");
  if (confirmButton && reservationDeletedPopup) {
    confirmButton.addEventListener("click", reservationDeletedPopup.openPopup);
  }
}

// Close reservationDeleted popup when homeButton is clicked
if (reservationDeletedPopup) {
  let homeButton = document.querySelector("#reservationDeleted .homeButton");
  if (homeButton) {
    homeButton.addEventListener("click", reservationDeletedPopup.closePopup);
  }
}