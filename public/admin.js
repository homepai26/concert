document.addEventListener('DOMContentLoaded', () => {
    loadConcerts();
    loadBookings();
    
    document.getElementById('addConcertForm').addEventListener('submit', addConcert);
});

// โหลดรายการคอนเสิร์ต
async function loadConcerts() {
    try {
        const response = await fetch('/api/admin/concerts');
        const concerts = await response.json();
        
        const concertsList = document.getElementById('concertsList');
        concertsList.innerHTML = concerts.map(concert => `
            <div class="concert-item">
                <div>
                    <h3>${concert.name}</h3>
                    <p>Date: ${new Date(concert.date).toLocaleDateString()}</p>
                    <p>Time: ${concert.time}</p>
                    <p>Venue: ${concert.venue}</p>
                    <p>Available: ${concert.available_seats}/${concert.total_seats}</p>
                    <p>Price: $${concert.price}</p>
                </div>
                <div class="admin-actions">
                    <button onclick="editConcert(${concert.id})" class="btn-edit">Edit</button>
                    <button onclick="deleteConcert(${concert.id})" class="btn-delete">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading concerts:', error);
    }
}

// โหลดรายการจอง
async function loadBookings() {
    try {
        const response = await fetch('/api/admin/bookings');
        const bookings = await response.json();
        
        const bookingsList = document.getElementById('bookingsList');
        bookingsList.innerHTML = bookings.map(booking => `
            <div class="booking-item">
                <div>
                    <h4>Booking #${booking.id}</h4>
                    <p>Concert: ${booking.concert_name}</p>
                    <p>User: ${booking.username}</p>
                    <p>Seat: ${booking.seat_number}</p>
                    <p>Status: <span class="status-${booking.status.toLowerCase()}">${booking.status}</span></p>
                </div>
                <div class="admin-actions">
                    <button onclick="updateBookingStatus(${booking.id}, 'confirmed')"
                            ${booking.status === 'CONFIRMED' ? 'disabled' : ''}>
                        Confirm
                    </button>
                    <button onclick="updateBookingStatus(${booking.id}, 'cancelled')"
                            ${booking.status === 'CANCELLED' ? 'disabled' : ''}>
                        Cancel
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading bookings:', error);
    }
}

// เพิ่มคอนเสิร์ตใหม่
async function addConcert(e) {
    e.preventDefault();
    
    const concertData = {
        name: document.getElementById('concertName').value,
        date: document.getElementById('concertDate').value,
        time: document.getElementById('concertTime').value,
        venue: document.getElementById('concertVenue').value,
        total_seats: document.getElementById('totalSeats').value,
        available_seats: document.getElementById('totalSeats').value,
        price: document.getElementById('concertPrice').value
    };

    try {
        const response = await fetch('/api/admin/concerts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(concertData)
        });

        const result = await response.json();
        if (result.success) {
            alert('Concert added successfully!');
            loadConcerts();
            e.target.reset();
        } else {
            alert('Failed to add concert: ' + result.message);
        }
    } catch (error) {
        console.error('Error adding concert:', error);
        alert('Error adding concert');
    }
}

// แก้ไขคอนเสิร์ต
async function editConcert(concertId) {
    // โค้ดสำหรับแก้ไขคอนเสิร์ต
    // สามารถเพิ่ม modal หรือฟอร์มแก้ไขได้ตามต้องการ
}

// ลบคอนเสิร์ต
async function deleteConcert(concertId) {
    if (!confirm('Are you sure you want to delete this concert?')) return;

    try {
        const response = await fetch(`/api/admin/concerts/${concertId}`, {
            method: 'DELETE'
        });

        const result = await response.json();
        if (result.success) {
            alert('Concert deleted successfully!');
            loadConcerts();
        } else {
            alert('Failed to delete concert: ' + result.message);
        }
    } catch (error) {
        console.error('Error deleting concert:', error);
        alert('Error deleting concert');
    }
}

// อัพเดทสถานะการจอง
async function updateBookingStatus(bookingId, status) {
    try {
        const response = await fetch(`/api/admin/bookings/${bookingId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status })
        });

        const result = await response.json();
        if (result.success) {
            alert(`Booking ${status} successfully!`);
            loadBookings();
        } else {
            alert('Failed to update booking: ' + result.message);
        }
    } catch (error) {
        console.error('Error updating booking:', error);
        alert('Error updating booking');
    }
} 