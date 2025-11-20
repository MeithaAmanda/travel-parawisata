document.addEventListener("DOMContentLoaded", () => {
    
    // 1. SAPAAN & NAMA USER
    const h1 = document.querySelector(".h1");
    const dateText = document.querySelector(".date-text");
    
    // Ambil Nama dari LocalStorage
    const storedName = localStorage.getItem('username');
    const displayName = storedName ? storedName : "Admin";

    // Cek Waktu
    const jam = new Date().getHours();
    let sapaan = "Halo";

    if (jam >= 4 && jam < 10) sapaan = "Selamat Pagi ☀️";
    else if (jam >= 10 && jam < 15) sapaan = "Selamat Siang 🌤️";
    else if (jam >= 15 && jam < 18) sapaan = "Selamat Sore 🌥️";
    else sapaan = "Selamat Malam 🌙";

    // Update Teks
    if(h1) {
        h1.innerHTML = `${sapaan}, <span style="color:#4f46e5; text-transform: capitalize;">${displayName}</span>`;
    }
    
    // Set Tanggal
    if(dateText) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const today = new Date().toLocaleDateString('id-ID', options);
        dateText.textContent = today;
    }

    // 2. SIDEBAR TOGGLE LOGIC
    const sidebar = document.getElementById("sidebar");
    const main = document.getElementById("main");
    const toggleBtn = document.getElementById("toggleBtn");

    if(toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            
            // Toggle class collapsed pada sidebar
            sidebar.classList.toggle("collapsed");

            // Cek apakah di Desktop (> 768px)
            if (window.innerWidth > 768) {
                // Jika sidebar mengecil (punya class collapsed), main content harus melebar (expanded)
                if (sidebar.classList.contains("collapsed")) {
                    main.classList.add("expanded");
                } else {
                    main.classList.remove("expanded");
                }
            } else {
                // Mode Mobile: CSS sudah menangani overlay
            }
        });
    }

    // 3. DROPDOWN
    const dropdowns = document.querySelectorAll(".dropdown-btn");
    dropdowns.forEach(btn => {
        btn.addEventListener("click", function() {
            // Jika sidebar sedang kecil, dropdown tidak bisa dibuka (opsional UX)
            if (sidebar.classList.contains("collapsed") && window.innerWidth > 768) return;

            const parentDropdown = this.parentElement;
            parentDropdown.classList.toggle("open");
        });
    });

    // 4. ANIMASI ANGKA STATISTIK
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

    // 5. LOGOUT
    const logoutBtn = document.getElementById('logoutBtn');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('username');
            // Sesuaikan path jika file login ada di luar folder admin
            window.location.href = '../login.html'; 
        });
    }

});