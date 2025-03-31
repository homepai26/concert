const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { registerValidation, bookingValidation } = require('./models/validation');

const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use(cors());
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false
}));

// Middleware ตรวจสอบ Token
const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, 'your_jwt_secret');
        req.user = verified;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

// ส่งอีเมลยืนยัน
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'your_email@gmail.com',
        pass: 'your_email_password'
    }
});

// Transaction Wrapper Function
const withTransaction = async (connection, callback) => {
    try {
        // เริ่ม transaction
        await connection.query('START TRANSACTION');
        
        // เรียกใช้ callback function
        const result = await callback();
        
        // ถ้าทุกอย่างสำเร็จ ทำการ commit
        await connection.query('COMMIT');
        return result;
    } catch (error) {
        try {
            // ถ้าเกิด error ทำการ rollback
            await connection.query('ROLLBACK');
        } catch (rollbackError) {
            console.error('Rollback failed:', rollbackError);
        }
        throw error;
    }
};

// API endpoints
app.post('/api/register', async (req, res) => {
    try {
        // Validate request body
        const { error } = registerValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { username, password, email } = req.body;
        
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // ลบการสร้าง verification_token
        const [result] = await db.execute(
            'INSERT INTO users (username, password, email, verified) VALUES (?, ?, ?, true)',
            [username, hashedPassword, email]
        );

        res.json({ success: true, userId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (users.length === 0) return res.status(400).json({ message: 'User not found' });
        
        const validPassword = await bcrypt.compare(password, users[0].password);
        if (!validPassword) return res.status(400).json({ message: 'Invalid password' });
        
        // ลบการตรวจสอบสถานะการยืนยันอีเมล
        const token = jwt.sign({ id: users[0].id }, 'your_jwt_secret');
        res.header('Authorization', token).json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Book ticket with payment
app.post('/api/book-ticket', authenticateToken, async (req, res) => {
    const connection = await db.getConnection();
    
    try {
        const { error } = bookingValidation.validate(req.body);
        if (error) return res.status(400).json({ message: error.details[0].message });

        const { concertId, seatNumber } = req.body;
        const userId = req.user.id;

        const result = await withTransaction(connection, async () => {
            // ตรวจสอบที่นั่งว่างก่อน
            const [seatCheck] = await connection.query(
                'SELECT available_seats FROM concerts WHERE id = ? FOR UPDATE',
                [concertId]
            );

            if (!seatCheck[0] || seatCheck[0].available_seats <= 0) {
                throw new Error('No seats available');
            }

            // ตรวจสอบว่าที่นั่งถูกจองแล้วหรือไม่
            const [existingSeat] = await connection.query(
                'SELECT id FROM bookings WHERE concert_id = ? AND seat_number = ? AND status != "cancelled"',
                [concertId, seatNumber]
            );

            if (existingSeat.length > 0) {
                throw new Error('Seat already booked');
            }

            // สร้างการจอง
            const [bookingResult] = await connection.query(
                'INSERT INTO bookings (user_id, concert_id, seat_number, status) VALUES (?, ?, ?, "pending")',
                [userId, concertId, seatNumber]
            );

            // สร้างรายการชำระเงิน
            const [concertPrice] = await connection.query(
                'SELECT price FROM concerts WHERE id = ?',
                [concertId]
            );

            await connection.query(
                'INSERT INTO payments (booking_id, amount, status) VALUES (?, ?, "pending")',
                [bookingResult.insertId, concertPrice[0].price]
            );

            // อัพเดทจำนวนที่นั่ง
            await connection.query(
                'UPDATE concerts SET available_seats = available_seats - 1 WHERE id = ?',
                [concertId]
            );

            return { bookingId: bookingResult.insertId };
        });

        res.json({ success: true, ...result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } finally {
        connection.release();
    }
});

// Cancel booking
app.post('/api/cancel-booking/:bookingId', authenticateToken, async (req, res) => {
    try {
        const { bookingId } = req.params;
        const userId = req.user.id;

        await withTransaction(db, async () => {
            // ล็อคการจองเพื่อป้องกันการแก้ไขพร้อมกัน
            const [booking] = await db.execute(
                'SELECT * FROM bookings WHERE id = ? AND user_id = ? FOR UPDATE',
                [bookingId, userId]
            );

            if (booking.length === 0) {
                throw new Error('Booking not found');
            }

            if (booking[0].status === 'cancelled') {
                throw new Error('Booking already cancelled');
            }

            // ตรวจสอบเวลายกเลิก (เช่น ต้องยกเลิกก่อนคอนเสิร์ต 24 ชั่วโมง)
            const [concert] = await db.execute(
                'SELECT date, time FROM concerts WHERE id = ?',
                [booking[0].concert_id]
            );

            const concertDateTime = new Date(`${concert[0].date} ${concert[0].time}`);
            const now = new Date();
            const hoursDiff = (concertDateTime - now) / (1000 * 60 * 60);

            if (hoursDiff < 24) {
                throw new Error('Cannot cancel booking less than 24 hours before concert');
            }

            // อัพเดทสถานะการจอง
            await db.execute(
                'UPDATE bookings SET status = "cancelled" WHERE id = ?',
                [bookingId]
            );

            // อัพเดทสถานะการชำระเงิน
            await db.execute(
                'UPDATE payments SET status = "refunded" WHERE booking_id = ?',
                [bookingId]
            );

            // คืนที่นั่ง
            await db.execute(
                'UPDATE concerts SET available_seats = available_seats + 1 WHERE id = ?',
                [booking[0].concert_id]
            );
        });

        res.json({ success: true, message: 'Booking cancelled successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/concerts', async (req, res) => {
    try {
        const [concerts] = await db.execute('SELECT * FROM concerts');
        res.json(concerts);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Admin API endpoints
app.get('/api/admin/concerts', async (req, res) => {
    try {
        const [concerts] = await db.execute('SELECT * FROM concerts');
        res.json(concerts);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/admin/concerts', async (req, res) => {
    try {
        const { name, date, time, venue, total_seats, available_seats, price } = req.body;
        
        const [result] = await db.execute(
            'INSERT INTO concerts (name, date, time, venue, total_seats, available_seats, price) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [name, date, time, venue, total_seats, available_seats, price]
        );

        res.json({ success: true, concertId: result.insertId });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/admin/concerts/:id', async (req, res) => {
    try {
        await db.execute('DELETE FROM concerts WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/admin/bookings', async (req, res) => {
    try {
        const [bookings] = await db.execute(`
            SELECT b.*, c.name as concert_name, u.username 
            FROM bookings b 
            JOIN concerts c ON b.concert_id = c.id 
            JOIN users u ON b.user_id = u.id
        `);
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.patch('/api/admin/bookings/:id', async (req, res) => {
    try {
        const { status } = req.body;
        await db.execute(
            'UPDATE bookings SET status = ? WHERE id = ?',
            [status, req.params.id]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 