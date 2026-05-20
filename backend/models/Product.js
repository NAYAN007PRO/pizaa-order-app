const db = require('../config/db');

class Product {
    static async getAll() {
        const [rows] = await db.query('SELECT * FROM products');
        return rows;
    }

    static async getById(id) {
        const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
        return rows[0];
    }

    static async create({ name, description, price, image_url, category_id }) {
        const [result] = await db.query(
            'INSERT INTO products (name, description, price, image_url, category_id) VALUES (?, ?, ?, ?, ?)',
            [name, description, price, image_url, category_id]
        );
        return result.insertId;
    }

    static async update(id, { name, description, price, image_url, is_available }) {
        await db.query(
            'UPDATE products SET name=?, description=?, price=?, image_url=?, is_available=? WHERE id=?',
            [name, description, price, image_url, is_available, id]
        );
    }

    static async delete(id) {
        await db.query('DELETE FROM products WHERE id = ?', [id]);
    }
}

module.exports = Product;