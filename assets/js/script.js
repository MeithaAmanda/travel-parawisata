document.addEventListener('DOMContentLoaded', () => {
      
    // --- IMPLEMENTASI 1: Efek Interaktif pada Kartu (Mouseover/Mouseout) ---
    const destinationCards = document.querySelectorAll('#destinasi article');

    destinationCards.forEach(card => {
      // Event Listener saat mouse masuk
      card.addEventListener('mouseover', () => {
        card.style.backgroundColor = '#eef2ff'; 
        const title = card.querySelector('h3');
        if(title) title.style.color = '#4338ca'; 
      });

      // Event Listener saat mouse keluar
      card.addEventListener('mouseout', () => {
        card.style.backgroundColor = '#ffffff';
        const title = card.querySelector('h3');
        if(title) title.style.color = '#1f2937'; 
      });
    });


    // --- IMPLEMENTASI 2: Pesan "Selamat Datang" Dinamis ---
    
    // Simulasi Login (Opsional: hapus jika sudah ada sistem login real)
    if (!localStorage.getItem('username')) {
      localStorage.setItem('username', 'Meitha Amanda');
    }

    const currentUser = localStorage.getItem('username');
    const authContainer = document.getElementById('auth-buttons');

    if (currentUser && authContainer) {
      authContainer.innerHTML = '';

      const welcomeMessage = document.createElement('span');
      welcomeMessage.className = 'font-semibold text-indigo-700 border-l-2 border-indigo-200 pl-4';
      welcomeMessage.textContent = `Selamat Datang, ${currentUser}!`;

      const logoutBtn = document.createElement('button');
      logoutBtn.textContent = '(Logout)';
      logoutBtn.className = 'text-xs text-red-500 hover:text-red-700 ml-2 font-medium';
      logoutBtn.onclick = () => {
        localStorage.removeItem('username'); 
        window.location.reload(); 
      };

      authContainer.appendChild(welcomeMessage);
      authContainer.appendChild(logoutBtn);
    }

  });