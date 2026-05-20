const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');

// Register User
exports.register = async (req, res) => {
    try {

        console.log("Register route hit");
        console.log(req.body);

        const { name, email, password, phone, address } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({
                message: 'Please fill all required fields',
            });
        }

        // Check Existing User
        const userExists = await User.findByEmail(email);

        if (userExists) {
            return res.status(400).json({
                message: 'User already exists',
            });
        }

        // Create User
        const userId = await User.create({
            name,
            email,
            password,
            phone,
            address,
        });

        // Fetch Created User
        const user = await User.findById(userId);

        // Response
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });

    } catch (error) {

        console.log("REGISTER ERROR:");
        console.log(error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};

// Login User
exports.login = async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check User
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        // Compare Password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                message: 'Invalid email or password',
            });
        }

        // Response
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id, user.role),
        });

    } catch (error) {

        console.log("LOGIN ERROR:");
        console.log(error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message,
        });
    }
};

// Get Profile
exports.getProfile = async (req, res) => {
    res.json(req.user);
};

// Get All Users
exports.getAllUsers = async (req, res) => {
    try {

        const users = await User.getAll();

        res.json(users);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error',
        });
    }
};

// Delete User
exports.deleteUser = async (req, res) => {
    try {

        await User.deleteById(req.params.id);

        res.json({
            message: 'User deleted successfully',
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error',
        });
    }
};