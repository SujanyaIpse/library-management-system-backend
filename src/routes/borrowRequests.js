const express = require('express');
const router = express.Router();
const { createBorrowRequest, approveBorrowRequest } = require('../controllers/borrowRequestsController');

// POST to create a borrow request
router.post('/', createBorrowRequest);

// PUT to approve a borrow request by ID
router.put('/:id/approve', approveBorrowRequest);

module.exports = router;
