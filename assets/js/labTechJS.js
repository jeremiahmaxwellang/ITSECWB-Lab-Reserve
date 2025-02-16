document.addEventListener('DOMContentLoaded', function () {
  console.log("Lab Tech Dashboard Loaded");

  const reservations = [
      { roomNumber: 'GK01', seatNumber: 'Seat #01', dateTime: 'August 5, 2025 - 01:01:01 PM' },
      { roomNumber: 'GK02', seatNumber: 'Seat #02', dateTime: 'August 6, 2025 - 02:30:00 PM' },
      { roomNumber: 'GK03', seatNumber: 'Seat #03', dateTime: 'August 7, 2025 - 10:15:00 AM' },
      { roomNumber: 'GK04', seatNumber: 'Seat #04', dateTime: 'August 8, 2025 - 04:45:00 PM' }
  ];

  function renderTable() {
      const tableBody = document.querySelector('#reservationsTable tbody');
      tableBody.innerHTML = ""; // Clear existing content

      reservations.forEach((reservation, index) => {
          const row = tableBody.insertRow();
          row.insertCell(0).innerText = reservation.roomNumber;
          row.insertCell(1).innerText = reservation.seatNumber;
          row.insertCell(2).innerText = reservation.dateTime;

          // Create Edit Button
          const editCell = row.insertCell(3);
          const editButton = document.createElement('button');
          editButton.className = 'editButton';
          editButton.innerText = 'Edit';
          editButton.onclick = () => showOverlay(reservation.roomNumber);
          editCell.appendChild(editButton);

          // Create Delete Button
          const deleteButton = document.createElement('button');
          deleteButton.className = 'deleteButton';
          deleteButton.innerText = 'Delete';
          deleteButton.onclick = () => showDeleteConfirmation(index);
          editCell.appendChild(deleteButton);
      });
  }

  function showOverlay(roomNumber) {
      console.log(`Editing reservation for room: ${roomNumber}`);
      alert(`Editing reservation for ${roomNumber}`); // Temporary alert (Replace with modal logic)
  }

  function showDeleteConfirmation(index) {
      console.log(`Showing delete confirmation for index: ${index}`);
      deletePopUp.openPopup();

      // Confirm Delete
      let confirmButton = document.querySelector("#deletePopUp .confirmButton");
      if (confirmButton) {
          confirmButton.onclick = function () {
              reservations.splice(index, 1); // Remove from array
              renderTable(); // Re-render table
              deletePopUp.closePopup();
              reservationDeletedPopup.openPopup();
          };
      }
  }

  // Popup System
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

  function closeAllPopups() {
      document.querySelectorAll(".popup.active").forEach(popup => {
          popup.classList.remove("active");
      });
  }

  // Create popups
  let deletePopUp = createPopup("#deletePopUp");
  let reservationDeletedPopup = createPopup("#reservationDeleted");

  // Click "Confirm" -> Close deletePopUp & Open reservationDeletedPopup
  if (deletePopUp && reservationDeletedPopup) {
      let confirmButton = document.querySelector("#deletePopUp .confirmButton");
      if (confirmButton) {
          confirmButton.addEventListener("click", () => {
              deletePopUp.closePopup();
              reservationDeletedPopup.openPopup();
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

  function redirectToDashboard() {
      window.location.href = "Dashboard.html";
  }

  function redirectToProfile() {
      window.location.href = "profile.html";
  }

  // Initial Render
  renderTable();
});
