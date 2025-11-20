document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('simpleAuthForm');

    // Helper Error Visual
    const toggleError = (inputId, show) => {
        const input = document.getElementById(inputId);
        if(!input) return;
        const errorMsg = input.nextElementSibling;
        
        if(show) {
            input.classList.add('input-error');
            if(errorMsg) errorMsg.classList.add('show');
        } else {
            input.classList.remove('input-error');
            if(errorMsg) errorMsg.classList.remove('show');
        }
    };

    if(form) {
        form.addEventListener('submit', (e) => {
            // 1. STOP RELOAD
            e.preventDefault();

            // 2. AMBIL ELEMENT
            const emailInput = document.getElementById('loginEmail');
            const passInput = document.getElementById('loginPassword');
            const roleInput = document.getElementById('loginRole');

            // Safety Check
            if (!emailInput || !passInput || !roleInput) {
                alert("Error: ID Input tidak ditemukan di HTML");
                return;
            }

            const email = emailInput.value.trim();
            const password = passInput.value.trim();
            const role = roleInput.value;
            let isValid = true;

            // 3. VALIDASI (Sesuai Kriteria)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) { toggleError('loginEmail', true); isValid = false; } 
            else toggleError('loginEmail', false);

            if (password.length < 8) { toggleError('loginPassword', true); isValid = false; } 
            else toggleError('loginPassword', false);

            if (role === "") { toggleError('loginRole', true); isValid = false; } 
            else toggleError('loginRole', false);

            // 4. REDIRECT (BAGIAN PENTING)
            if (isValid) {
                localStorage.setItem('username', email.split('@')[0]);
                alert("Login Berhasil! Mengalihkan...");

                // --- PERBAIKAN PATH DI SINI ---
                
                if (role === 'admin') {
                    // Asumsi: indexadmin.html ada di dalam folder 'admin'
                    // Kita gunakan path relatif tanpa '/' di depan
                    console.log("Go to Admin");
                    window.location.href = 'admin/indexadmin.html'; 
                } 
                else if (role === 'mitra') {
                    // Asumsi: dashboard_mitra.html ada di dalam folder 'mitra'
                    console.log("Go to Mitra");
                    window.location.href = 'mitra/dashboard_mitra.html'; 
                } 
                else {
                    // Asumsi: index.html ada di dalam folder 'main'
                    console.log("Go to User");
                    window.location.href = '/index.html'; 
                }
            }
        });
    }
});