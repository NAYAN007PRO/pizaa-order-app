const express = require('express');
const cors = require('cors');
const http = require('http'); // Import http
const { Server } = require('socket.io'); // Import Socket.io
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();

// 1. Create HTTP server and attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Allow React Frontend
        methods: ["GET", "POST"]
    }
});

// 2. Middleware
app.use(cors());
app.use(express.json());

// 3. Make 'io' accessible in our controllers (Important!)
app.set('socketio', io);

// 4. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Pizza App API is running...');
});

// 5. Socket.io Connection Logic
io.on('connection', (socket) => {
    console.log(`Admin Connected: ${socket.id}`);
    
    // Join a specific room for admins
    socket.on('join_admin_room', () => {
        socket.join('admin_room');
        console.log('User joined admin room');
    });

    socket.on('disconnect', () => {
        console.log('User Disconnected');
    });
});

const PORT = process.env.PORT || 5000;
// Note: We use 'server.listen' instead of 'app.listen' for Socket.io
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));