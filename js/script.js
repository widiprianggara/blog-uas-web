// script untuk responsive navbar

document.addEventListener("DOMContentLoaded", () => {
    const menuIcon = document.getElementById("menu-icon");
    const menuList = document.getElementById("menu-list");
  
    menuIcon.addEventListener("click", () => {
        menuList.classList.toggle("hidden");
    });
  });