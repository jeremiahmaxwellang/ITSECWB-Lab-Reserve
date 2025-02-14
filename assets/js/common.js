document.addEventListener("DOMContentLoaded", function () {
  const profileIcon = document.querySelector(".profile-icon");
  const dropdownMenu = document.getElementById("profile-dropdown");

  // Toggle dropdown visibility when clicking the profile icon
  profileIcon.addEventListener("click", function (event) {
      event.stopPropagation(); // Prevents closing immediately
      dropdownMenu.classList.toggle("show");
  });

  // Close dropdown if clicking anywhere outside
  document.addEventListener("click", function (event) {
      if (!profileIcon.contains(event.target) && !dropdownMenu.contains(event.target)) {
          dropdownMenu.classList.remove("show");
      }
  });

  // Logout function
  document.getElementById("logout-btn").addEventListener("click", function () {
      alert("Logging out..."); // Replace this with actual logout logic
      window.location.href = "logout.html"; // Redirect to logout
  });

  // Redirect to profile page
  document.getElementById("profile-btn").addEventListener("click", function () {
      window.location.href = "profile.html";
  });
});
