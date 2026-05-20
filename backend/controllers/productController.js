const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
    try {
        const products = await Product.getAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, image_url, category_id } = req.body;
        const id = await Product.create({ name, description, price, image_url, category_id });
        res.status(201).json({ id, message: 'Product created' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        await Product.update(req.params.id, req.body);
        res.json({ message: 'Product updated' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        await Product.delete(req.params.id);
        res.json({ message: 'Product removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};