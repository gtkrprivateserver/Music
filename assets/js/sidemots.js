/* assets/js/sidemots.js
   Sidebar render + dropdown + menu button + robust loading hide
*/

document.addEventListener("DOMContentLoaded", () => {
  // render sidebar only if container exists
  let sidebar = document.getElementById("sidebar");
  if (!sidebar) return;

  sidebar.innerHTML = `
    <div class="sidebar">
      <div class="title">OneDev</div>
      <ul>
        <li><a href="index.html">Home</a></li>

        <li>
          <a href="#" class="dropdown-btn">Company <span>▾</span></a>
          <div class="dropdown-items">
            <a href="about.html">About Us</a>
            <a href="careers.html">Careers</a>
            <a href="legal.html">Legal</a>
            <a href="privacy.html">Privacy Policy</a>
          </div>
        </li>

        <li>
          <a href="#" class="dropdown-btn">Services <span>▾</span></a>
          <div class="dropdown-items">
            <a href="services.html">All Services</a>
            <a href="products.html">Products</a>
          </div>
        </li>

        <li><a href="contact.html">Contact</a></li>
      </ul>
    </div>
  `;

  // dropdown toggle (delegation)
  sidebar.querySelectorAll(".dropdown-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const items = btn.parentElement.querySelector(".dropdown-items");
      items.classList.toggle("show");
      btn.classList.toggle("active");
    });
  });

  // menu button toggles sidebar
  const menuBtn = document.getElementById("menu-btn");
  if (menuBtn) {
    menuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("open");
      // optional: toggle aria-expanded for accessibility
      const expanded = sidebar.classList.contains("open");
      menuBtn.setAttribute("aria-expanded", expanded ? "true" : "false");
    });
  }

  // click outside close (mobile)
  document.addEventListener("click", (e) => {
    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target)) {
      sidebar.classList.remove("open");
    }
  });

  // keyboard ESC to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") sidebar.classList.remove("open");
  });
});

// safe loading hide
window.addEventListener("load", () => {
  const loader = document.getElementById("onedev-loading");
  if (loader) {
    loader.classList.add("hide");
    // remove after fade to keep DOM clean
    setTimeout(()=> loader.remove(), 800);
  }
});