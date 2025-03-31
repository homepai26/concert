const express = require('express');
const session = require('express-session');
const User = require('./models/User');
const Booking = require('./models/Booking');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false
}));

// API endpoints
app.post('/api/register', async (req, res) => {
    try {
        const { username, password, email, language } = req.body;
        const userId = await User.create(username, password, email, language);
        res.json({ success: true, userId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.authenticate(username, password);
        
        if (user) {
            req.session.userId = user.id;
            req.session.language = user.language;
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/seats', async (req, res) => {
    try {
        const seats = await Booking.getAvailableSeats();
        res.json(seats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.post('/api/bookings', async (req, res) => {
    if (!req.session.userId) {
        return res.status(401).json({ error: 'Please login first' });
    }
    
    try {
        const { seatId } = req.body;
        const bookingId = await Booking.createBooking(req.session.userId, seatId);
        res.json({ success: true, bookingId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
}); 