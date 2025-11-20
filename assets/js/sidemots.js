/* ========================================================
   OneDev Company — sidemots.js
   Sidebar Otomatis + Dropdown + Loading Screen Fix
======================================================== */

// ---- Render Sidebar Otomatis ----
document.addEventListener("DOMContentLoaded", () => {
  const sidebarContainer = document.getElementById("sidebar");

  if (sidebarContainer) {
    sidebarContainer.innerHTML = `
      <div class="sidebar">
        <div class="title">OneDev</div>
        <ul>
          <li><a href="index.html">Home</a></li>

          <li>
            <a href="#" class="dropdown-btn">Company ▼</a>
            <div class="dropdown-items">
              <a href="about.html">About Us</a>
              <a href="legal.html">Legal</a>
              <a href="privacy.html">Privacy Policy</a>
            </div>
          </li>

          <li>
            <a href="#" class="dropdown-btn">Services ▼</a>
            <div class="dropdown-items">
              <a href="services.html">All Services</a>
            </div>
          </li>

          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
    `;
  }

  // ---- Dropdown System ----
  document.querySelectorAll(".dropdown-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const dropdown = btn.nextElementSibling;
      dropdown.style.display =
        dropdown.style.display === "block" ? "none" : "block";
    });
  });
});

// ---- Loading Screen (FIX anti-error) ----
window.addEventListener("load", () => {
  const loader = document.getElementById("onedev-loading");

  // Jika element loading ditemukan → sembunyikan
  if (loader) {
    loader.classList.add("hide");
  }
});