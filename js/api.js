// Base API URL
const API_BASE_URL = "https://primdev.alwaysdata.net/api";

// Redirect jika belum login
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (window.location.pathname.includes("index.html") && !token) {
    alert("Please log in first!");
    window.location.href = "login.html";
  }

  if (token && window.location.pathname.includes("index.html")) {
    getBlogs();
  }
});

// Login
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
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
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirm_password: password }),
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
const logoutButton = document.getElementById("logout-btn");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });
}

// CRUD for Blog Posts

// Fetch blog posts and display them in a table
async function getBlogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`);
    const blogs = await response.json();

    if (!response.ok) {
      throw new Error(`Error fetching blogs: ${response.status}`);
    }

    if (blogs.length === 0) {
      document.getElementById("BlogList").innerHTML = "<tr><td colspan='6'>No blogs available</td></tr>";
      return;
    }

    let table = `
      <tr>
        <th>ID</th>
        <th>Image</th>
        <th>Title</th>
        <th>Slug</th>
        <th>Content</th>
        <th>Action</th>
      </tr>`;

    blogs.forEach((blog) => {
      table += `
        <tr>
          <td>${blog.id}</td>
          <td><img src="${blog.image}" alt="Blog Image" style="width: 50px; height: auto;"></td>
          <td>${blog.title}</td>
          <td>${blog.slug}</td>
          <td>${blog.content}</td>
          <td class="btn-blog">
            <button class="edit" onclick="editBlog(${blog.id}, '${blog.title}', '${blog.slug}', '${blog.content}', '${blog.image}')">Edit</button>
            <button class="delete" onclick="deleteBlog(${blog.id})">Delete</button>
          </td>
        </tr>`;
    });

    document.getElementById("BlogList").innerHTML = table;
  } catch (error) {
    console.error("Error fetching blogs:", error);
    alert(`Error: ${error.message}`);
  }
}

// Create or Update a blog post
const storyForm = document.getElementById("story-form");
let isEditing = false; // Flag to check if we're editing

if (storyForm) {
  storyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const slug = document.getElementById("slug").value;
    const content = document.getElementById("content").value;
    const image = document.getElementById("image").files[0]; // Get the selected image file

    if (!title || !slug || !content) {
      alert("All fields are required!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", slug);
    formData.append("content", content);
    if (image) {
      formData.append("image", image); // Append the image file to the form data
    }

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing ? `${API_BASE_URL}/blog/${storyForm.dataset.blogId}` : `${API_BASE_URL}/blog`;

    try {
      const response = await fetch(url, {
        method: method,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert(isEditing ? "Blog updated successfully!" : "Blog created successfully!");
        getBlogs();
        storyForm.reset();
        isEditing = false; // Reset the editing flag
        storyForm.dataset.blogId = ""; // Clear dataset
      } else {
        alert(data.message || "Failed to process blog");
      }
    } catch (error) {
      console.error("Error processing blog:", error);
      alert("Error processing blog. Please try again.");
    }
  });
}

// Fungsi untuk menampilkan pratinjau gambar yang diupload
function previewImage(event) {
  const file = event.target.files[0];  // Mengambil file dari input file
  const reader = new FileReader();  // Membaca file

  reader.onload = function () {
    const preview = document.getElementById("image-preview");  // Mengambil elemen pratinjau
    preview.src = reader.result;  // Set src gambar dengan hasil pembacaan file
    preview.style.display = "block";  // Menampilkan gambar pratinjau
  };

  if (file) {
    reader.readAsDataURL(file);  // Membaca file yang diupload sebagai data URL
  }
}

// Edit blog post
function editBlog(id, title, slug, content, image) {
  document.getElementById("title").value = title;
  document.getElementById("slug").value = slug;
  document.getElementById("content").value = content;
  document.getElementById("submit-story").innerText = "Update Story";

  // Menampilkan pratinjau gambar
  const previewImage = document.getElementById("image-preview");
  previewImage.src = image;  // Menetapkan gambar dari URL yang ada
  previewImage.style.display = "block";  // Menampilkan pratinjau gambar

  // Set editing flag dan store blog id
  isEditing = true;
  storyForm.dataset.blogId = id;
}

// Delete blog post
async function deleteBlog(id) {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();
    if (response.ok) {
      alert("Blog deleted successfully!");
      getBlogs();
    } else {
      alert(data.message || "Failed to delete blog");
    }
  } catch (error) {
    console.error("Error deleting blog:", error);
    alert("Error deleting blog. Please try again.");
  }
}