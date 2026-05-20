const db = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
    static async findByEmail(email) {
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        return rows[0];
    }

    static async findById(id) {
        const [rows] = await db.query('SELECT id, name, email, role, phone, address FROM users WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ name, email, password, phone, address, role }) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            'INSERT INTO users (name, email, password, phone, address, role) VALUES (?, ?, ?, ?, ?, ?)',
            [name, email, hashedPassword, phone, address, role || 'user']
        );
        return result.insertId;
    }

    // ✅ ADDED - missing methods used by authController
    static async getAll() {
        const [rows] = await db.query('SELECT id, name, email, role, phone, address, created_at FROM users');
        return rows;
    }

    static async deleteById(id) {
        await db.query('DELETE FROM users WHERE id = ?', [id]);
    }
}

module.exports = User;