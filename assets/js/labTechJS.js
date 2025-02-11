function createPopup(id) {
  let popupNode = document.querySelector(id);
  
  if (!popupNode) {
    console.error(`Element with ID ${id} not found.`);
    return null;
  }

  let overlay = popupNode.querySelector(".overlay");
  let closeButton = popupNode.querySelector(".closeButton");
  let cancelButton = popupNode.querySelector(".cancelButton");

  function openPopUp() {
    popupNode.classList.add("active");
  }

  function closePopup() {
    popupNode.classList.remove("active");
  }

  if (overlay) overlay.addEventListener("click", closePopup);
  if (closeButton) closeButton.addEventListener("click", closePopup);
  if (cancelButton) cancelButton.addEventListener("click", closePopup);

  return openPopUp;
}

// Create delete popup
let deletePopUp = createPopup("#deletePopUp");

// Apply the popup to all delete buttons
if (deletePopUp) {
  document.querySelectorAll(".deleteButton").forEach(button => {
    button.addEventListener("click", deletePopUp);
  });
}