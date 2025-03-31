const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const config = require('../config/database');

class User {
    static async create(username, password, email, language = 'th') {
        const connection = await mysql.createConnection(config);
        const hashedPassword = await bcrypt.hash(password, 10);
        
        try {
            const [result] = await connection.execute(
                'INSERT INTO users (username, password, email, language) VALUES (?, ?, ?, ?)',
                [username, hashedPassword, email, language]
            );
            return result.insertId;
        } finally {
            await connection.end();
        }
    }

    static async authenticate(username, password) {
        const connection = await mysql.createConnection(config);
        
        try {
            const [rows] = await connection.execute(
                'SELECT * FROM users WHERE username = ?',
                [username]
            );
            
            if (rows.length === 0) return null;
            
            const user = rows[0];
            const valid = await bcrypt.compare(password, user.password);
            
            return valid ? user : null;
        } finally {
            await connection.end();
        }
    }
}

module.exports = User; 