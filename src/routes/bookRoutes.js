const express = require('express');
const { getAllBooks, addBook } = require('../controllers/bookController');
const router = express.Router();

router.get('/', getAllBooks);
router.post('/', addBook);

module.exports = router;
