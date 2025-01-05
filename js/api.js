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

// Fetch and Display Blogs
async function getBlogs() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/blogs`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const blogs = await response.json();
      const blogContainer = document.getElementById("blog-container");

      if (blogContainer) {
        blogContainer.innerHTML = blogs
          .map(
            (blog) => `
          <div class="blog-box">
            <div class="blog-text">
              <span>${new Date(blog.date).toLocaleDateString()} / ${blog.category}</span>
              <a href="#" class="blog-title">${blog.title}</a>
              <p>${blog.content}</p>
              <div class="btn-blog">
                <button class="edit" onclick="editBlog('${blog.id}')">Edit</button>
                <button class="delete" onclick="deleteBlog('${blog.id}')">Delete</button>
              </div>
            </div>
          </div>`
          )
          .join("");
      }
    } else {
      alert("Failed to fetch blogs.");
    }
  } catch (error) {
    console.error("Error fetching blogs:", error);
  }
}

// Create Blog
const blogForm = document.querySelector("#write-stories form");
if (blogForm) {
  blogForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const content = document.querySelector("textarea[name='stories']").value;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/blogs`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      if (response.ok) {
        alert("Blog created successfully!");
        getBlogs();
        blogForm.reset();
      } else {
        alert("Failed to create blog.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
    }
  });
}

// Update Blog
async function editBlog(blogId) {
  const newTitle = prompt("Enter new title:");
  const newContent = prompt("Enter new content:");

  if (newTitle && newContent) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: "PUT",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTitle, content: newContent }),
      });

      if (response.ok) {
        alert("Blog updated successfully!");
        getBlogs();
      } else {
        alert("Failed to update blog.");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
    }
  }
}

// Delete Blog
async function deleteBlog(blogId) {
  if (confirm("Are you sure you want to delete this blog?")) {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/blogs/${blogId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        alert("Blog deleted successfully!");
        getBlogs();
      } else {
        alert("Failed to delete blog.");
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    }
  }
}
