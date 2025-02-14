function redirectToDashboard() {
  window.location.href = "Dashboard.html";
}

function redirectToProfile() {
  window.location.href = "profile.html";
}

// Profile Dropdown Toggle
document.addEventListener("DOMContentLoaded", function () {
  var profileBtn = document.getElementById("profileDropdownBtn");
  var dropdown = document.getElementById("profileDropdown");

  if (profileBtn && dropdown) {
      profileBtn.addEventListener("click", function (event) {
          event.stopPropagation(); // Prevents closing when clicking on the button
          dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
      });

      // Close dropdown when clicking outside
      document.addEventListener("click", function (event) {
          if (!dropdown.contains(event.target) && event.target !== profileBtn) {
              dropdown.style.display = "none";
          }
      });
  }
});
