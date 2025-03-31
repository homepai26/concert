const translations = {
    th: {
        login: 'เข้าสู่ระบบ',
        register: 'สมัครสมาชิก',
        username: 'ชื่อผู้ใช้',
        password: 'รหัสผ่าน',
        email: 'อีเมล',
        book: 'จอง',
        available: 'ว่าง',
        reserved: 'จองแล้ว'
    },
    en: {
        login: 'Login',
        register: 'Register',
        username: 'Username',
        password: 'Password',
        email: 'Email',
        book: 'Book',
        available: 'Available',
        reserved: 'Reserved'
    }
};

let currentLanguage = 'th';

function setLanguage(lang) {
    currentLanguage = lang;
    updateTexts();
}

function updateTexts() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        element.textContent = translations[currentLanguage][key];
    });
}

async function login(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            location.reload();
        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function register(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;
    const email = document.getElementById('register-email').value;
    
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password, email, language: currentLanguage })
        });
        
        if (response.ok) {
            alert('Registration successful');
            document.getElementById('login-form').style.display = 'block';
            document.getElementById('register-form').style.display = 'none';
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

async function loadSeats() {
    try {
        const response = await fetch('/api/seats');
        const seats = await response.json();
        
        const seatsContainer = document.getElementById('seats-container');
        seatsContainer.innerHTML = '';
        
        seats.forEach(seat => {
            const seatElement = document.createElement('div');
            seatElement.className = `seat ${seat.status}`;
            seatElement.textContent = seat.seat_number;
            
            if (seat.status === 'available') {
                seatElement.onclick = () => bookSeat(seat.id);
            }
            
            seatsContainer.appendChild(seatElement);
        });
    } catch (error) {
        console.error('Error:', error);
    }
}

async function bookSeat(seatId) {
    try {
        const response = await fetch('/api/bookings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seatId })
        });
        
        if (response.ok) {
            alert('Booking successful');
            loadSeats();
        } else {
            alert('Booking failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Load seats when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadSeats();
    updateTexts();
}); 