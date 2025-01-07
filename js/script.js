// Script untuk responsive navbar
document.addEventListener("DOMContentLoaded", () => {
  // Mendapatkan elemen menu icon dan menu list
  const menuIcon = document.getElementById("menu-icon");
  const menuList = document.getElementById("menu-list");

  // Menambahkan event listener untuk toggle menu saat icon menu di klik
  menuIcon.addEventListener("click", () => {
    // Mengubah kelas menu-list antara "hidden" atau tidak, untuk menunjukkan/menghiding menu
    menuList.classList.toggle("hidden");
  });
});

// Script untuk mengatur dropdown menu pengguna
document.addEventListener("DOMContentLoaded", function () {
  // Mendapatkan elemen user icon dan dropdown menu
  const userIcon = document.getElementById("user-icon");
  const dropdownMenu = document.getElementById("dropdown-menu");

  // Menambahkan event listener pada userIcon untuk membuka/menutup dropdown menu saat icon diklik
  userIcon.addEventListener("click", function () {
    // Toggle kelas "active" untuk menampilkan atau menyembunyikan dropdown menu
    dropdownMenu.classList.toggle("active");
  });

  // Menambahkan event listener untuk menutup dropdown jika pengguna mengklik di luar dropdown menu
  document.addEventListener("click", function (event) {
    // Jika pengguna mengklik di luar elemen userIcon, maka dropdown akan disembunyikan
    if (!userIcon.contains(event.target)) {
      dropdownMenu.classList.remove("active");
    }
  });
});
