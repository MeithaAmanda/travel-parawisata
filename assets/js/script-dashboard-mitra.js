document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================
    // 1. LOGIKA SAPAAN & USER
    // ==========================================
    function displayGreeting() {
        // Target elemen tempat nama akan muncul
        const userNameElement = document.querySelector('.text-right .text-sm.font-bold');
        
        // Ambil nama dari LocalStorage
        const storedName = localStorage.getItem('username');
        const displayName = storedName ? storedName : "Mitra TripNesia";

        // Tentukan Waktu (Pagi/Siang/Sore)
        const jam = new Date().getHours();
        let sapaan = "Halo";
        if (jam >= 4 && jam < 10) sapaan = "Selamat Pagi";
        else if (jam >= 10 && jam < 15) sapaan = "Selamat Siang";
        else if (jam >= 15 && jam < 18) sapaan = "Selamat Sore";
        else sapaan = "Selamat Malam";

        // Update Teks di HTML
        if (userNameElement) {
            userNameElement.innerHTML = `${sapaan}, <span class="text-indigo-600 capitalize">${displayName}</span>`;
        }
    }
    
    // Panggil fungsi sapaan saat halaman dimuat
    displayGreeting();


    // ==========================================
    // 2. UI DASHBOARD (SIDEBAR & TABS)
    // ==========================================

    // --- Toggle Sidebar ---
    const sidebar = document.getElementById("premiumSidebar");
    const mainContent = document.getElementById("mainContent");
    const toggleBtn = document.getElementById("toggleSidebar");

    if(toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            // Toggle class untuk CSS
            sidebar.classList.toggle("collapsed");
            
            // Logika tambahan untuk Desktop (ubah margin)
            if(window.innerWidth > 768) {
                if (sidebar.classList.contains("collapsed")) {
                    // Jika sidebar mengecil
                    mainContent.classList.add("expanded"); // Tambahkan class margin kecil
                    // Atau pakai inline style: mainContent.style.marginLeft = "78px";
                } else {
                    // Jika sidebar membesar
                    mainContent.classList.remove("expanded"); // Hapus class margin kecil
                    // Atau pakai inline style: mainContent.style.marginLeft = "260px";
                }
            }
            // Di Mobile, CSS sudah menangani (overlay/slide), jadi JS cukup toggle class
        });
    }

    // --- Tab Switching Logic (SPA Sederhana) ---
    window.switchTab = function(viewId, element) {
        // Sembunyikan semua konten section
        document.querySelectorAll('.section-content').forEach(el => el.classList.remove('active'));
        
        // Tampilkan konten yang dipilih
        const targetView = document.getElementById('view-' + viewId);
        if(targetView) targetView.classList.add('active');

        // Update status aktif di Sidebar Menu
        document.querySelectorAll('.menu-item').forEach(el => el.classList.remove('active'));
        if(element) element.classList.add('active');

        // Update Judul Halaman di Header
        const titles = {
            'dashboard': 'Ringkasan Bisnis',
            'paket': 'Manajemen Paket Wisata',
            'pesanan': 'Daftar Pesanan Masuk',
            'keuangan': 'Laporan Pendapatan'
        };
        const pageTitle = document.getElementById('pageTitle');
        if(pageTitle) pageTitle.innerText = titles[viewId];

        // Khusus Tab Paket: Render ulang data agar selalu fresh
        if(viewId === 'paket') renderPackages();
    };


    // ==========================================
    // 3. MANAJEMEN PAKET WISATA (CRUD & LOGIC)
    // ==========================================

    // Data Dummy Awal
    let packages = [
        { id: 1, name: "Open Trip Bromo Sunrise", price: 350000, duration: "12 Jam", location: "Malang", status: "active", sold: 124, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
        { id: 2, name: "Private Trip Raja Ampat", price: 5200000, duration: "4H 3M", location: "Papua", status: "active", sold: 12, image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
        { id: 3, name: "Camping Ranca Upas", price: 200000, duration: "2H 1M", location: "Bandung", status: "draft", sold: 0, image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d" },
        { id: 4, name: "Explore Nusa Penida", price: 450000, duration: "1 Hari", location: "Bali", status: "review", sold: 5, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" }
    ];

    let currentFilter = 'all';
    let editingId = null;

    // Helper Format Rupiah
    const rupiah = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);

    // --- FUNGSI RENDER (TAMPILKAN DATA) ---
    window.renderPackages = function() {
        const grid = document.getElementById('packageGrid');
        const searchInput = document.getElementById('searchPackage');
        
        // Cek apakah elemen grid ada (karena mungkin sedang di tab lain)
        if(!grid) return;

        const searchValue = searchInput ? searchInput.value.toLowerCase() : '';
        grid.innerHTML = ''; // Bersihkan isi lama

        // Filter Data berdasarkan Status & Search
        const filtered = packages.filter(p => {
            const statusMatch = currentFilter === 'all' || p.status === currentFilter;
            const searchMatch = p.name.toLowerCase().includes(searchValue);
            return statusMatch && searchMatch;
        });

        // Update Counter (Menampilkan X paket)
        const countEl = document.getElementById('pkgCount');
        if(countEl) countEl.innerText = filtered.length;

        // Jika Kosong
        if (filtered.length === 0) {
            grid.innerHTML = `<div class="col-span-full text-center py-12 text-gray-400 flex flex-col items-center">
                <i class="bi bi-inbox text-4xl mb-2"></i>
                <p>Tidak ada paket ditemukan.</p>
            </div>`;
            return;
        }

        // Loop Data & Buat HTML Kartu
        filtered.forEach(pkg => {
            let badge = '';
            if (pkg.status === 'active') badge = `<span class="badge badge-active absolute top-3 right-3 shadow-sm">Tayang</span>`;
            else if (pkg.status === 'review') badge = `<span class="badge badge-review absolute top-3 right-3 shadow-sm">Review</span>`;
            else badge = `<span class="badge badge-draft absolute top-3 right-3 shadow-sm">Draft</span>`;

            const html = `
            <div class="pkg-card group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">
                <div class="card-img-wrapper h-48 relative bg-gray-100">
                    <img src="${pkg.image}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt="${pkg.name}">
                    ${badge}
                </div>
                <div class="p-5 flex flex-col flex-1">
                    <h3 class="font-bold text-lg text-gray-800 mb-1 leading-tight line-clamp-1" title="${pkg.name}">${pkg.name}</h3>
                    <div class="text-sm text-gray-500 mb-4 flex gap-2 items-center">
                        <i class="bi bi-geo-alt text-indigo-500"></i> ${pkg.location} &bull; ${pkg.duration}
                    </div>
                    
                    <div class="mt-auto flex items-end justify-between pt-4 border-t border-gray-50">
                        <div>
                            <span class="text-xs text-gray-400 block">Harga per pax</span>
                            <span class="text-lg font-bold text-indigo-600">${rupiah(pkg.price)}</span>
                        </div>
                        <div class="text-right">
                            <span class="text-xs text-gray-400 block">Terjual</span>
                            <span class="font-semibold text-gray-800">${pkg.sold}</span>
                        </div>
                    </div>

                    <div class="mt-4 flex gap-2 pt-2">
                        <button onclick="editPackage(${pkg.id})" class="flex-1 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">Edit</button>
                        <button onclick="deletePackage(${pkg.id})" class="flex-1 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">Hapus</button>
                    </div>
                </div>
            </div>`;
            grid.innerHTML += html;
        });
    };

    // --- FILTER STATUS ---
    window.filterPackages = function(status) {
        currentFilter = status;
        // Update Tampilan Tombol Filter
        document.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active', 'bg-white', 'text-indigo-600', 'shadow-sm'));
        const activeTab = document.getElementById('tab-' + status);
        if(activeTab) activeTab.classList.add('active', 'bg-white', 'text-indigo-600', 'shadow-sm');
        renderPackages();
    };

    // --- SEARCH ---
    const searchInput = document.getElementById('searchPackage');
    if(searchInput) {
        searchInput.addEventListener('input', renderPackages);
    }


    // ==========================================
    // 4. MODAL FORM (TAMBAH & EDIT)
    // ==========================================
    
    const modal = document.getElementById('packageModal');
    const form = document.getElementById('packageForm');

    window.openModal = function() {
        if(modal) modal.classList.remove('hidden');
        editingId = null;
        document.getElementById('modalTitle').innerText = 'Tambah Paket Baru';
        if(form) form.reset();
    };

    window.closeModal = function() {
        if(modal) modal.classList.add('hidden');
    };

    // --- FUNGSI SIMPAN DATA ---
    window.savePackage = function() {
        const name = document.getElementById('inpName').value;
        const price = document.getElementById('inpPrice').value;
        const duration = document.getElementById('inpDuration').value;
        const location = document.getElementById('inpLocation').value;
        const status = document.getElementById('inpStatus').value;
        const image = document.getElementById('inpImage').value || "https://via.placeholder.com/400x300";

        if (!name || !price) {
            alert("Mohon lengkapi Nama Paket dan Harga.");
            return;
        }

        if (editingId) {
            // Mode Edit: Update Data yang Ada
            const idx = packages.findIndex(p => p.id === editingId);
            if (idx !== -1) {
                packages[idx] = { ...packages[idx], name, price, duration, location, status, image };
                alert("Paket berhasil diperbarui!");
            }
        } else {
            // Mode Tambah: Buat Data Baru
            const newId = packages.length ? Math.max(...packages.map(p => p.id)) + 1 : 1;
            packages.unshift({ id: newId, name, price: parseInt(price), duration, location, status, image, sold: 0 });
            alert("Paket baru berhasil ditambahkan!");
        }

        closeModal();
        renderPackages();
    };

    // --- FUNGSI EDIT ---
    window.editPackage = function(id) {
        const p = packages.find(x => x.id === id);
        if (p) {
            editingId = id;
            document.getElementById('modalTitle').innerText = 'Edit Paket Wisata';
            
            // Isi form dengan data lama
            document.getElementById('inpName').value = p.name;
            document.getElementById('inpPrice').value = p.price;
            document.getElementById('inpDuration').value = p.duration;
            document.getElementById('inpLocation').value = p.location;
            document.getElementById('inpStatus').value = p.status;
            document.getElementById('inpImage').value = p.image;
            
            if(modal) modal.classList.remove('hidden');
        }
    };

    // --- FUNGSI HAPUS ---
    window.deletePackage = function(id) {
        if(confirm("Apakah Anda yakin ingin menghapus paket ini?")) {
            packages = packages.filter(p => p.id !== id);
            renderPackages();
        }
    };

    // --- LOGOUT ---
    const logoutBtn = document.querySelector('.sidebar-footer');
    if(logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('username'); // Bersihkan sesi
            window.location.href = '../login.html'; // Sesuaikan path ke login
        });
    }

    // Initial Render (Opsional: jalankan jika ingin langsung load data saat masuk)
    // renderPackages(); 
});