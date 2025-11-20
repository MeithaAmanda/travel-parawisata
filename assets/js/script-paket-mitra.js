// --- DATA DUMMY ---
let packages = [
    { id: 1, name: "Open Trip Bromo Sunrise", price: 350000, duration: "1 Hari", location: "Malang", status: "active", sold: 45, image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
    { id: 2, name: "Eksplorasi Pulau Komodo", price: 4200000, duration: "3H 2M", location: "Labuan Bajo", status: "active", sold: 12, image: "https://images.unsplash.com/photo-1545569341-9eb8b30979d4" },
    { id: 3, name: "Hidden Gem Nusa Penida", price: 850000, duration: "1 Hari", location: "Bali", status: "review", sold: 0, image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee" },
    { id: 4, name: "Raja Ampat Wayag Trip", price: 7500000, duration: "4H 3M", location: "Papua", status: "draft", sold: 0, image: "https://images.unsplash.com/photo-1516690561799-46d8f74f9dab" },
    { id: 5, name: "Camping Ranca Upas", price: 150000, duration: "2H 1M", location: "Bandung", status: "active", sold: 88, image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d" }
];

// State Aplikasi
let currentFilter = 'all';
let searchQuery = '';
let editingId = null;

// --- UNGSI HELPER & RENDER ---
const rupiah = (number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);

function renderPackages() {
    const grid = document.getElementById('packageGrid');
    grid.innerHTML = '';

    // Filter Logic
    const filtered = packages.filter(pkg => {
        const matchStatus = currentFilter === 'all' || pkg.status === currentFilter;
        const matchSearch = pkg.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchStatus && matchSearch;
    });

    // Update Count
    document.getElementById('showingCount').innerText = filtered.length;

    if (filtered.length === 0) {
        grid.innerHTML = `<div class="col-span-full text-center py-20 text-gray-400">Tidak ada paket yang ditemukan.</div>`;
        return;
    }

    // Loop & Create HTML
    filtered.forEach(pkg => {
        // Tentukan warna badge & label
        let badgeHTML = '';
        if(pkg.status === 'active') badgeHTML = `<span class="badge badge-active">Tayang</span>`;
        else if(pkg.status === 'review') badgeHTML = `<span class="badge badge-review">Review</span>`;
        else badgeHTML = `<span class="badge badge-draft">Draft</span>`;

        const card = `
            <div class="pkg-card group">
                <div class="card-img-wrapper">
                    <img src="${pkg.image}" alt="${pkg.name}" class="card-img">
                    ${badgeHTML}
                </div>
                <div class="p-5 flex flex-col flex-1">
                    <div class="flex justify-between items-start mb-2">
                        <h3 class="font-bold text-lg text-gray-900 leading-tight">${pkg.name}</h3>
                    </div>
                    <div class="text-sm text-gray-500 mb-4 flex items-center gap-2">
                        <span>⏱ ${pkg.duration}</span>
                        <span>•</span>
                        <span>📍 ${pkg.location}</span>
                    </div>
                    
                    <div class="mt-auto pt-4 border-t border-gray-100 flex items-end justify-between">
                        <div>
                            <p class="text-xs text-gray-400 mb-1">Harga per pax</p>
                            <p class="text-lg font-bold text-indigo-600">${rupiah(pkg.price)}</p>
                        </div>
                        <div class="text-right">
                            <p class="text-xs text-gray-400 mb-1">Terjual</p>
                            <p class="font-semibold text-gray-900">${pkg.sold}</p>
                        </div>
                    </div>

                    <div class="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onclick="editPackage(${pkg.id})" class="flex-1 bg-indigo-50 text-indigo-700 py-2 rounded-lg text-sm font-medium hover:bg-indigo-100">Edit</button>
                        <button onclick="deletePackage(${pkg.id})" class="flex-1 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-medium hover:bg-red-100">Hapus</button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += card;
    });
}

// --- FILTER & SEARCH ---
function filterStatus(status) {
    currentFilter = status;
    
    // Update UI Tabs
    document.querySelectorAll('.filter-tab').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`tab-${status}`).classList.add('active');
    
    renderPackages();
}

document.getElementById('searchInput').addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderPackages();
});

// --- 4. MODAL LOGIC ---
const modal = document.getElementById('packageModal');
const form = document.getElementById('packageForm');

function openModal() {
    modal.classList.remove('hidden');
    editingId = null;
    document.getElementById('modalTitle').innerText = 'Tambah Paket Baru';
    form.reset();
}

function closeModal() {
    modal.classList.add('hidden');
}

// --- CRUD OPERATIONS ---
function savePackage() {
    // Ambil value dari form
    const name = document.getElementById('inputName').value;
    const price = parseInt(document.getElementById('inputPrice').value);
    const duration = document.getElementById('inputDuration').value;
    const location = document.getElementById('inputLocation').value;
    const status = document.getElementById('inputStatus').value;
    const image = document.getElementById('inputImage').value || "https://via.placeholder.com/400x300";

    if (!name || !price) {
        alert("Nama dan Harga wajib diisi!");
        return;
    }

    if (editingId) {
        // Update Existing
        const index = packages.findIndex(p => p.id === editingId);
        if (index !== -1) {
            packages[index] = { ...packages[index], name, price, duration, location, status, image };
        }
    } else {
        // Add New
        const newId = packages.length ? Math.max(...packages.map(p => p.id)) + 1 : 1;
        packages.unshift({
            id: newId,
            name, price, duration, location, status, image,
            sold: 0 // Default
        });
    }

    closeModal();
    renderPackages();
}

function editPackage(id) {
    const pkg = packages.find(p => p.id === id);
    if (pkg) {
        editingId = id;
        document.getElementById('modalTitle').innerText = 'Edit Paket Wisata';
        
        // Isi form
        document.getElementById('inputName').value = pkg.name;
        document.getElementById('inputPrice').value = pkg.price;
        document.getElementById('inputDuration').value = pkg.duration;
        document.getElementById('inputLocation').value = pkg.location;
        document.getElementById('inputStatus').value = pkg.status;
        document.getElementById('inputImage').value = pkg.image;
        
        modal.classList.remove('hidden');
    }
}

function deletePackage(id) {
    if (confirm('Yakin ingin menghapus paket ini?')) {
        packages = packages.filter(p => p.id !== id);
        renderPackages();
    }
}

// Initial Render
document.addEventListener('DOMContentLoaded', renderPackages);