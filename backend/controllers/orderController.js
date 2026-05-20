const Order = require('../models/Order');

// @desc    Create new order
// @route   POST /api/orders
exports.addOrderItems = async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress } = req.body;
        
        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'No order items' });
        }

        const orderId = await Order.create(req.user.id, { items, totalAmount, deliveryAddress });
        
        // REAL-TIME FEATURE: Notify Admin
        const io = req.app.get('socketio');
        const orders = await Order.getAll(); 
        const newOrder = orders.find(o => o.id === orderId);
        
        if (io) {
            io.to('admin_room').emit('order_received', newOrder);
        }

        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error placing order' });
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.getByUserId(req.user.id);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.getAll();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
    try {
        await Order.updateStatus(req.params.id, req.body.status);
        res.json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};