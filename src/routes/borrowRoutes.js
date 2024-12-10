const db = require('../database/db');
const express = require('express');
const router = express.Router();

const { createBorrowRequest } = require('../controllers/borrowController');
const { approveBorrowRequest } = require('../controllers/borrowRequestsController'); // Import the controller

router.put('/:id/approve', (req, res) => {
    const borrowRequestId = req.params.id;

    const query = 'SELECT * FROM borrow_requests WHERE id = ?';
    db.get(query, [borrowRequestId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving borrow request.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Borrow request not found' });
        }
        
        // Check if the request is already approved
        if (row.status === 'approved') {
            return res.status(400).json({ error: 'This borrow request is already approved.' });
        }

        const updateQuery = 'UPDATE borrow_requests SET status = ? WHERE id = ?';
        db.run(updateQuery, ['approved', borrowRequestId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating borrow request status.' });
            }
            res.json({ message: 'Borrow request approved successfully.' });
        });
    });
});

// Deny Borrow Request
router.put('/:id/deny', (req, res) => {
    const borrowRequestId = req.params.id;

    // Check if the borrow request exists
    const query = 'SELECT * FROM borrow_requests WHERE id = ?';
    db.get(query, [borrowRequestId], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving borrow request.' });
        }
        if (!row) {
            return res.status(404).json({ error: 'Borrow request not found.' });
        }

        // Update the status to 'denied'
        const updateQuery = 'UPDATE borrow_requests SET status = ? WHERE id = ?';
        db.run(updateQuery, ['denied', borrowRequestId], (err) => {
            if (err) {
                return res.status(500).json({ error: 'Error updating borrow request status.' });
            }
            res.json({ message: 'Borrow request denied successfully.' });
        });
    });
});

module.exports = router;

router.post('/', createBorrowRequest);
// In your bookRoutes.js or wherever the POST request is handled
// Add a new book
router.post('/book', (req, res) => {
    const { title, author, quantity } = req.body;
  
    // Log the incoming request to check the data being sent
    console.log(req.body);
  
    // Validate the required fields
    if (!title || !author || !quantity) {
      return res.status(400).json({ error: "All fields are required." });
    }
  
    // Insert the book into the database
    const query = 'INSERT INTO books (title, author, quantity) VALUES (?, ?, ?)';
    db.run(query, [title, author, quantity], function (err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.status(201).json({
        message: "Book added successfully",
        bookId: this.lastID
      });
    });
  });
  
  module.exports = router;