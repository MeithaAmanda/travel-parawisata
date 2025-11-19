// nyumputkeun sidebar
const sidebar = document.getElementById("sidebar");
const mainContent = document.getElementById("main");
const toggleBtn = document.getElementById("toggleBtn");

toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("hidden");
    mainContent.classList.toggle("full");
});

// keur bagean dropdown
const dropdownButtons = document.querySelectorAll(".dropdown-btn");

dropdownButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const parent = btn.parentElement;

        if (parent.classList.contains("open")) {
            parent.classList.remove("open");
        } else {
            document.querySelectorAll(".dropdown").forEach(d => d.classList.remove("open"));
            parent.classList.add("open");
        }
    });
});

//  ACTIVE MENU HANDLER 
const sideLinks = document.querySelectorAll(".nav-list a, .dropdown-items a");

sideLinks.forEach(link => {
    link.addEventListener("click", () => {
        sideLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
    });
});

// data halaman di dashboard
const stats = {
    users: 128,
    paket: 52,
    transaksi: 211,
    mitra: 14
};

//  LOAD STAT KE DASHBOARD 
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".stat-number-users").textContent = stats.users;
    document.querySelector(".stat-number-paket").textContent = stats.paket;
    document.querySelector(".stat-number-transaksi").textContent = stats.transaksi;
    document.querySelector(".stat-number-mitra").textContent = stats.mitra;
});

// cek responsive
function checkScreen() {
    if (window.innerWidth < 850) {
        sidebar.classList.add("collapsed");
    } else {
        sidebar.classList.remove("collapsed");
    }
}

window.addEventListener("resize", checkScreen);
checkScreen();

// smooth menu
document.querySelectorAll(".dropdown-items").forEach(items => {
    items.style.transition = "0.25s ease";
});
