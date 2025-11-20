// LOADING
window.onload = () => {
    setTimeout(() => {
        document.getElementById("loading").style.display = "none";
    }, 1000);
};

// SIDEBAR
const sidebar = document.getElementById("sidebar");
document.getElementById("openSidebar").onclick = () => sidebar.classList.add("active");
document.getElementById("closeSidebar").onclick = () => sidebar.classList.remove("active");

// SIDEBAR DROPDOWN
document.querySelectorAll(".dropdown-btn").forEach(btn => {
    btn.addEventListener("click", () => {
        btn.parentElement.classList.toggle("active");
    });
});