document.addEventListener('DOMContentLoaded', () => {
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
            alert('Registration successful! Please check your email to verify your account.');
            showLoginForm(); // แสดงฟอร์มล็อกอินหลังจากลงทะเบียนสำเร็จ
        } else {
            alert('Registration failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('Error during registration');
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
                <p>Date: ${new Date(concert.date).toLocaleDateString()}</p>
                <p>Time: ${concert.time}</p>
                <p>Venue: ${concert.venue}</p>
                <p>Available Seats: ${concert.available_seats}</p>
                <p>Price: $${concert.price}</p>
                <button onclick="showBookingForm(${concert.id}, ${concert.available_seats})">
                    Book Ticket
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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                concertId,
                seatNumber
            })
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Booking successful!');
            loadConcerts();
            document.getElementById('bookingForm').classList.add('hidden');
        } else {
            alert('Booking failed: ' + result.message);
        }
    } catch (error) {
        console.error('Error booking ticket:', error);
        alert('Error booking ticket');
    }
}); 