// script untuk responsive navbar
document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menu-icon");
  const menuList = document.getElementById("menu-list");
  const userIcon = document.getElementById("user-icon");
  const dropdownMenu = document.getElementById("dropdown-menu");

  // Toggle menu visibility
  menuIcon.addEventListener("click", () => {
    menuList.classList.toggle("hidden");
  });

  // Toggle user dropdown visibility
  userIcon.addEventListener("click", () => {
    dropdownMenu.classList.toggle("active");
  });

  // Close dropdown if user clicks outside
  document.addEventListener("click", (event) => {
    if (!userIcon.contains(event.target)) {
      dropdownMenu.classList.remove("active");
    }
  });
});
