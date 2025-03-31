const mysql = require('mysql2/promise');
const config = require('../config/database');

class Booking {
    static async getAvailableSeats() {
        const connection = await mysql.createConnection(config);
        
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM seats WHERE status = "available"'
            );
            return rows;
        } finally {
            await connection.end();
        }
    }

    static async createBooking(userId, seatId) {
        const connection = await mysql.createConnection(config);
        
        try {
            await connection.beginTransaction();
            
            // ตรวจสอบว่าที่นั่งว่างอยู่หรือไม่
            const [seats] = await connection.execute(
                'SELECT * FROM seats WHERE id = ? AND status = "available"',
                [seatId]
            );
            
            if (seats.length === 0) {
                throw new Error('Seat not available');
            }
            
            // จองที่นั่ง
            await connection.execute(
                'UPDATE seats SET status = "reserved" WHERE id = ?',
                [seatId]
            );
            
            // สร้างการจอง
            const [result] = await connection.execute(
                'INSERT INTO bookings (user_id, seat_id) VALUES (?, ?)',
                [userId, seatId]
            );
            
            await connection.commit();
            return result.insertId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            await connection.end();
        }
    }
}

module.exports = Booking; 