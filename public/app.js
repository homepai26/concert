// เพิ่มตัวแปรสำหรับเก็บภาษาปัจจุบัน
let currentLang = localStorage.getItem('language') || 'en';

// ฟังก์ชันเปลี่ยนภาษา
function changeLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('language', lang);
    translatePage();
    loadConcerts(); // โหลดคอนเสิร์ตใหม่เพื่อแสดงในภาษาที่เลือก
}

// ฟังก์ชันแปลหน้าเว็บ
function translatePage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (element.tagName === 'INPUT') {
            element.placeholder = translations[currentLang][key];
        } else {
            element.textContent = translations[currentLang][key];
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    translatePage();
    loadConcerts();
    document.getElementById('showRegister').addEventListener('click', showRegisterForm);
    document.getElementById('showLogin').addEventListener('click', showLoginForm);
});

// ฟังก์ชันแสดงฟอร์มลงทะเบียน
function showRegisterForm() {
    document.getElementById('login-form').classList.add('hidden');
    document.getElementById('register-form').classList.remove('hidden');
}

// ฟังก์ชันแสดงฟอร์มล็อกอิน
function showLoginForm() {
    document.getElementById('register-form').classList.add('hidden');
    document.getElementById('login-form').classList.remove('hidden');
}

// ฟังก์ชันสำหรับการลงทะเบียน
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('registerUsername').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        });

        const result = await response.json();
        if (result.success) {
            alert(translations[currentLang].registerSuccess);
            showLoginForm(); // แสดงฟอร์มล็อกอินหลังจากลงทะเบียนสำเร็จ
        } else {
            alert(translations[currentLang].registerFailed + result.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert(translations[currentLang].registrationError);
    }
});

// ฟังก์ชันโหลดคอนเสิร์ต
async function loadConcerts() {
    try {
        const response = await fetch('/api/concerts');
        const concerts = await response.json();
        
        const concertList = document.getElementById('concertList');
        concertList.innerHTML = concerts.map(concert => `
            <div class="concert-card">
                <h3>${concert.name}</h3>
                <p>${translations[currentLang].date}: ${new Date(concert.date).toLocaleDateString()}</p>
                <p>${translations[currentLang].time}: ${concert.time}</p>
                <p>${translations[currentLang].venue}: ${concert.venue}</p>
                <p>${translations[currentLang].availableSeats}: ${concert.available_seats}</p>
                <p>${translations[currentLang].price}: $${concert.price}</p>
                <button onclick="showBookingForm(${concert.id}, ${concert.available_seats})">
                    ${translations[currentLang].bookTicket}
                </button>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading concerts:', error);
    }
}

// ฟังก์ชันแสดงฟอร์มจองตั๋ว
function showBookingForm(concertId, availableSeats) {
    const bookingForm = document.getElementById('bookingForm');
    const seatSelect = document.getElementById('seatNumber');
    document.getElementById('concertId').value = concertId;
    
    seatSelect.innerHTML = '';
    for (let i = 1; i <= availableSeats; i++) {
        const option = document.createElement('option');
        option.value = `SEAT-${i}`;
        option.textContent = `Seat ${i}`;
        seatSelect.appendChild(option);
    }
    
    bookingForm.classList.remove('hidden');
}

// ฟังก์ชันสำหรับการจองตั๋ว
document.getElementById('ticketForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const concertId = document.getElementById('concertId').value;
    const seatNumber = document.getElementById('seatNumber').value;
    
    try {
        const response = await fetch('/api/book-ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({
                concertId,
                seatNumber
            })
        });
        
        const result = await response.json();
        if (result.success) {
            alert(translations[currentLang].bookingSuccess);
            loadConcerts();
            document.getElementById('bookingForm').classList.add('hidden');
        } else {
            alert(translations[currentLang].bookingFailed + result.message);
        }
    } catch (error) {
        console.error('Error booking ticket:', error);
        alert(translations[currentLang].bookingError);
    }
});

// ฟังก์ชันล็อกอิน
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();
        if (result.token) {
            localStorage.setItem('token', result.token);
            alert(translations[currentLang].loginSuccess);
            loadConcerts();
        } else {
            alert(translations[currentLang].loginFailed + result.message);
        }
    } catch (error) {
        console.error('Error during login:', error);
        alert(translations[currentLang].loginError);
    }
}); 