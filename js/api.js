// Base API URL
// URL utama untuk mengakses API backend
const API_BASE_URL = "https://primdev.alwaysdata.net/api";

// Fungsi umum untuk mengambil token
// Mengambil token dari LocalStorage untuk otentikasi pengguna
const getToken = () => localStorage.getItem("token");

// Redirect jika belum login
// Event listener ini akan mengecek apakah pengguna telah login (memiliki token)
// Jika tidak, pengguna akan diarahkan ke halaman login
document.addEventListener("DOMContentLoaded", () => {
  const token = getToken();

  // Jika belum login dan berada di halaman index.html, alihkan ke login.html
  if (!token && window.location.pathname.includes("index.html")) {
    alert("Please log in first!");
    window.location.href = "login.html";
  }

  // Jika login dan berada di halaman index.html, panggil fungsi untuk menampilkan blog
  if (token && window.location.pathname.includes("index.html")) {
    getBlogs();
  }
});

// Login
// Fungsi untuk menangani form login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Mencegah reload halaman setelah submit
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validasi input
    if (!email || !password) {
      alert("Email dan password wajib diisi!");
      return;
    }

    try {
      // Kirim request login ke API
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        // Simpan token ke LocalStorage dan arahkan ke halaman index.html
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        window.location.href = "index.html";
      } else {
        alert(data.message || "Invalid credentials");
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert("An error occurred during login. Please try again.");
    }
  });
}

// Register
// Fungsi untuk menangani form registrasi
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault(); // Mencegah reload halaman setelah submit
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document
      .getElementById("confirm-password")
      .value.trim();

    // Validasi input
    if (!name || !email || !password || !confirmPassword) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      // Kirim request registrasi ke API
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          confirm_password: password,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful! Please log in.");
        window.location.href = "login.html";
      } else {
        alert(data.message || "Failed to register");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration. Please try again.");
    }
  });
}

// Logout
// Fungsi untuk menangani logout
const logoutButton = document.getElementById("logout-btn-btn");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token"); // Hapus token dari LocalStorage
    alert("Logged out successfully!");
    window.location.href = "login.html"; // Redirect ke halaman login
  });
}

// CRUD for Blog Posts
// Function to fetch and display blogs
// Mengambil daftar blog dari API dan menampilkannya di tabel
async function getBlogs() {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Unauthorized! Please log in.");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/blog`, {
      headers: {
        Authorization: `Bearer ${token}`, // Token untuk otentikasi
      },
    });

    const blogs = await response.json();

    if (!response.ok) {
      throw new Error(
        blogs.message || `Error fetching blogs: ${response.status}`
      );
    }

    // Render blog list ke dalam tabel HTML
    let table = `
      <tr>
        <th>ID</th>
        <th>Image</th>
        <th>Title</th>
        <th>Content</th>
        <th>Action</th>
      </tr>`;

    blogs.forEach((blog) => {
      table += `
        <tr>
          <td>${blog.id}</td>
          <td>
            <img 
              src="${blog.image}" 
              alt="Blog Image" 
              style="width: 50px; height: auto;" 
            />
          </td>
          <td>${blog.title}</td>
          <td>${blog.content}</td>
          <td class="btn-blog">
            <button 
              class="edit" 
              onclick="editBlog(${blog.id}, '${blog.image}', '${blog.title}', '${blog.content}')"
            >
              Edit
            </button>
            <button 
              class="delete" 
              onclick="deleteBlog(${blog.id})"
            >
              Delete
            </button>
          </td>
        </tr>`;
    });

    document.getElementById("BlogList").innerHTML = table;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    alert(`Error: ${error.message}`);
  }
}
