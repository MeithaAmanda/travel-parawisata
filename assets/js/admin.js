document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. LOGIKA SAPAAN & NAMA USER (DIGABUNG) ---
    const h1 = document.querySelector(".h1"); // Selector untuk Admin
    const dateText = document.querySelector(".date-text");
    
    // Ambil Nama dari LocalStorage
    const storedName = localStorage.getItem('username');
    // Jika ada nama, pakai nama itu. Jika tidak, pakai "Admin"
    const displayName = storedName ? storedName : "Admin";

    // Cek Waktu
    const jam = new Date().getHours();
    let sapaan = "Halo";

    if (jam >= 4 && jam < 10) sapaan = "Selamat Pagi ☀️";
    else if (jam >= 10 && jam < 15) sapaan = "Selamat Siang 🌤️";
    else if (jam >= 15 && jam < 18) sapaan = "Selamat Sore 🌥️";
    else sapaan = "Selamat Malam 🌙";

    // Update Teks di HTML
    if(h1) {
        // Tampilkan Sapaan + Nama User (Capitalize agar huruf depan besar)
        h1.innerHTML = `${sapaan}, <span style="color:#16a34a; text-transform: capitalize;">${displayName}</span>`;
    }
    
    // Set Tanggal Hari Ini
    if(dateText) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('id-ID', options);
        dateText.textContent = today;
    }

    // --- 2. SIDEBAR TOGGLE ---
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    const toggleBtn = document.getElementById("toggleBtn");

    if(toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            if (window.innerWidth > 768) {
                // Mode Desktop
                sidebar.classList.toggle("close"); // Pastikan di CSS ada class .close { width: 78px ... } atau transform
                main.classList.toggle("full");
            } else {
                // Mode Mobile
                sidebar.classList.toggle("active"); // Pastikan di CSS ada class .active { left: 0 }
            }
        });
    }

    // --- 3. DROPDOWN SMOOTH ---
    const dropdowns = document.querySelectorAll(".dropdown-btn");

    dropdowns.forEach(btn => {
        btn.addEventListener("click", function() {
            const parentDropdown = this.parentElement;
            parentDropdown.classList.toggle("open");
        });
    });

    // --- 4. ACTIVE MENU ---
    const links = document.querySelectorAll(".sidebar a");
    links.forEach(link => {
        link.addEventListener("click", function() {
            links.forEach(l => l.classList.remove("active"));
            document.querySelectorAll(".menu-item").forEach(m => m.classList.remove("active"));
            
            this.classList.add("active");
            
            if(this.parentElement.classList.contains("dropdown-content")){
                this.closest(".dropdown").querySelector(".dropdown-btn").classList.add("active");
            }
        });
    });

    // --- 5. ANIMASI ANGKA (COUNTER) ---
    const stats = {
        users: 128,
        paket: 52,
        transaksi: 211,
        mitra: 14
    };

    const animateValue = (selector, start, end, duration) => {
        const obj = document.querySelector(selector);
        if (!obj) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    animateValue(".stat-number-users", 0, stats.users, 2000);
    animateValue(".stat-number-paket", 0, stats.paket, 1500);
    animateValue(".stat-number-transaksi", 0, stats.transaksi, 2500);
    animateValue(".stat-number-mitra", 0, stats.mitra, 1000);

});