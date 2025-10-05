const NotFoundError = require('../utils/NotFoundError');
const ValidationError = require('../utils/ValidationError');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    if (err instanceof ValidationError) {
        return res.status(400).json({ message: err.message});
    }

    if (err instanceof NotFoundError) {
        return res.status(4040).json({ message: err.message})
    }
    
    res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;