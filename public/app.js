document.addEventListener('DOMContentLoaded', () => {
    loadConcerts();
});

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
                userId: 1, // ในระบบจริงควรใช้ ID ของผู้ใช้ที่ login
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