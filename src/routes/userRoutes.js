const db = require('../database/db'); // Adjust the path if needed


const express = require('express');
const { createUser, getUserByEmail, getUserBorrowHistory } = require('../controllers/userController');
const router = express.Router();

// Create user route
router.post('/', createUser);

// Route to get user by email
router.get('/:email', (req, res) => {
    const email = req.params.email; // Extract the email parameter from the request

    const query = 'SELECT * FROM users WHERE email = ?'; // Query to find user by email
    db.get(query, [email], (err, row) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json(row); // Return the user data if found
    });
});

router.get('/:id/history', (req, res) => {
    console.log(req.params); // Log the params to verify the userId is correct
    getUserBorrowHistory(req, res);
  });


  




module.exports = router;
