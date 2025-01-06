// Base API URL
const API_BASE_URL = "https://primdev.alwaysdata.net/api";
// const token = "491|m1fQYlf1lGVo2RyNMTq17o6SxQif6K7y6IrsefVf";

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
    // const token = localStorage.getItem("token");
    const response = await fetch(`${API_BASE_URL}/blog`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
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
              <span>${new Date(blog.date).toLocaleDateString()} / ${
              blog.category
            }</span>
              <a href="#" class="blog-title">${blog.title}</a>
              <p>${blog.content}</p>
              <div class="btn-blog">
                <button class="edit" onclick="editBlog('${
                  blog.id
                }')">Edit</button>
                <button class="delete" onclick="deleteBlog('${
                  blog.id
                }')">Delete</button>
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
      //   const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
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
      //   const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
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
      //   const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/blog/${blogId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
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

// CRUD for Blog Posts

// Fetch blog posts and display them in a table
async function getBlogs() {
  try {
    const response = await fetch(`${API_BASE_URL}/blog`);
    const blogs = await response.json();

    if (!response.ok) {
      throw new Error(`Error fetching blogs: ${response.status}`);
    }

    let table = `
      <tr>
        <th>ID</th>
        <th>Title</th>
        <th>Slug</th>
        <th>Content</th>
        <th>Action</th>
      </tr>`;

    blogs.forEach((blog) => {
      table += `
        <tr>
          <td>${blog.id}</td>
          <td>${blog.title}</td>
          <td>${blog.slug}</td>
          <td>${blog.content}</td>
          <td class="btn-blog">
            <button class="edit" onclick="editBlog(${blog.id}, '${blog.title}', '${blog.content}')">Edit</button>
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

// Create a new blog post
const storyForm = document.getElementById("story-form");
if (storyForm) {
  storyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value;
    const content = document.getElementById("story-content").value;
    const image = document.getElementById("image-upload").files[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("image", image);

    try {
      const response = await fetch(`${API_BASE_URL}/blog`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert("Blog created successfully!");
        getBlogs();
        storyForm.reset();
      } else {
        alert(data.message || "Failed to create blog");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      alert("Error creating blog. Please try again.");
    }
  });
}

// Edit blog post
function editBlog(id, title, content) {
  document.getElementById("title").value = title;
  document.getElementById("story-content").value = content;
  document.getElementById("submit-story").innerText = "Update Story";

  // Change submit button behavior
  storyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const updatedTitle = document.getElementById("title").value;
    const updatedContent = document.getElementById("story-content").value;

    const updatedBlog = {
      title: updatedTitle,
      content: updatedContent,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/blog/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(updatedBlog),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Blog updated successfully!");
        getBlogs();
        storyForm.reset();
      } else {
        alert(data.message || "Failed to update blog");
      }
    } catch (error) {
      console.error("Error updating blog:", error);
      alert("Error updating blog. Please try again.");
    }
  });
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