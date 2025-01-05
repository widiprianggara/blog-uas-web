// script untuk responsive navbar

document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menu-icon");
  const menuList = document.getElementById("menu-list");

  menuIcon.addEventListener("click", () => {
      menuList.classList.toggle("hidden");
  });
});

document.addEventListener("DOMContentLoaded", function () {
  const userIcon = document.getElementById("user-icon");
  const dropdownMenu = document.getElementById("dropdown-menu");

  userIcon.addEventListener("click", function () {
    dropdownMenu.classList.toggle("active");
  });

  // Menutup dropdown jika pengguna mengklik di luar
  document.addEventListener("click", function (event) {
    if (!userIcon.contains(event.target)) {
      dropdownMenu.classList.remove("active");
    }
  });
});