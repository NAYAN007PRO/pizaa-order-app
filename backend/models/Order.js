const db = require('../config/db');

class Order {
    static async create(userId, orderData) {
        const { totalAmount, deliveryAddress, items } = orderData;
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const [orderResult] = await connection.query(
                'INSERT INTO orders (user_id, total_amount, delivery_address, status) VALUES (?, ?, ?, ?)',
                [userId, totalAmount, deliveryAddress, 'Pending']
            );
            const orderId = orderResult.insertId;

            const itemQueries = items.map(item => 
                connection.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price_at_order) VALUES (?, ?, ?, ?)',
                    [orderId, item.productId, item.quantity, item.price]
                )
            );
            await Promise.all(itemQueries);

            await connection.commit();
            return orderId;
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }

    static async getByUserId(userId) {
        const [orders] = await db.query(
            `SELECT o.id, o.total_amount, o.status, o.created_at, GROUP_CONCAT(p.name SEPARATOR ', ') as items_summary
             FROM orders o JOIN order_items oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id
             WHERE o.user_id = ? GROUP BY o.id ORDER BY o.created_at DESC`, 
            [userId]
        );
        return orders;
    }

    static async getAll() {
        const [orders] = await db.query(
            `SELECT o.id, o.total_amount, o.status, o.created_at, u.name as user_name, u.email
             FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.created_at DESC`
        );
        return orders;
    }

    static async updateStatus(orderId, status) {
        await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, orderId]);
    }
}

module.exports = Order;