// AUTO SIDEBAR MENU
const pages = [
  { name: "Home", link: "index.html" },
  { name: "Tentang", link: "about.html" },
  { name: "Layanan", link: "services.html" },
  { name: "Kontak", link: "contact.html" },
  { name: "Privacy Policy", link: "privacy.html" },
  { name: "Legal", link: "legal.html" }
];

window.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const menuBtn = document.getElementById("menuBtn");
  const sidebarMenu = document.getElementById("sidebarMenu");

  // Generate menu otomatis
  pages.forEach(p => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${p.link}" style="color:white;text-decoration:none;">${p.name}</a>`;
    sidebarMenu.appendChild(li);
  });

  // toggle sidebar
  menuBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
});