const { v4: uuidv4 } = require('uuid');
const { NotFoundError, ValidationError } = require('../utils/errors');

// Sample in-memory products database
let product = [
  {
    id: '1',
    name: 'Laptop',
    description: 'High-performance laptop with 16GB RAM',
    price: 1200,
    category: 'electronics',
    inStock: true
  },
  {
    id: '2',
    name: 'Smartphone',
    description: 'Latest model with 128GB storage',
    price: 800,
    category: 'electronics',
    inStock: true
  },
  {
    id: '3',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with timer',
    price: 50,
    category: 'kitchen',
    inStock: false
  }
];

// Get all products
const getProducts =(req, res) => {
    let { category, page = 1, limit = 5 } = req.query;
    let filteredProducts = product;

    if (category){
        filteredProducts = filteredProducts.filter(p => p.category === category);   
    }

    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    res.json({
        total: filteredProducts.length,
        page: parseInt(page, 10),
        products: filteredProducts.slice(startIndex, endIndex),
    });
};



// Get a specific product by ID
const getProductById = (req, res, next) => {
    const product = product.find(p => p.id === req.params.id);
    if (!product) {
        return next(new NotFoundError('Product not found'));
    }
    res.json(product);
};

// Create a new product
const createProduct = (req, res) => {
    const { name, description, price, category, inStock } = req.body;
    const newProduct = {
        id: uuidv4(),
        name,
        description,
        price,
        category,
        inStock
    };
    product.push(newProduct);
    res.status(201).json(newProduct);
};


// Update a product by ID
const updateProduct = (req, res, next) => {
    const productIndex = product.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
        return next(new NotFoundError('Product not found'));
    }
    const { name, description, price, category, inStock } = req.body;
    product[productIndex] = {
        ...product[productIndex],
        name,
        description,
        price,
        category,
        inStock
    };
    res.json(product[productIndex]);
};



// Delete a product by ID
const deleteProduct = (req, res, next) => {
    const productIndex = product.findIndex(p => p.id === req.params.id);
    if (productIndex === -1) {
        return next(new NotFoundError('Product not found'));
    }
    product.splice(productIndex, 1);
    res.status(204).end();
};


// Search products by name or description
const searchProducts = (req, res) => {
    const { q } = req.query;
    if (!q) {
        return res.status(400).json({ message: 'Query parameter "q" is required' });
    }
    const results = product.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.description.toLowerCase().includes(q.toLowerCase())
    );
    res.json({ total: results.length, results });
};


// Get product statistics
const getProductStats = (req, res) => {
    const totalProducts = product.length;
    const categories = [...new Set(product.map(p => p.category))];
    const productsPerCategory = categories.reduce((acc, category) => {
        acc[category] = product.filter(p => p.category === category).length;
        return acc;
    }, {});
    const averagePrice = totalProducts ? (product.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(2) : 0;

    res.json({
        totalProducts,
        categories,
        productsPerCategory,
        averagePrice: parseFloat(averagePrice)
    });
};  

module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    getProductStats
};
