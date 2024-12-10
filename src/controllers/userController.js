const bcrypt = require('bcryptjs');
const db = require('../database/db');

const createUser = (req, res) => {
    const { email, password, role } = req.body;

    if (!email || !password || !role) {
        return res.status(400).json({ error: "All fields are required." });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);
    const query = `INSERT INTO Users (email, password, role) VALUES (?, ?, ?)`;

    db.run(query, [email, hashedPassword, role], function (err) {
        if (err) {
            return res.status(500).json({ error: "Error creating user." });
        }
        res.status(201).json({ message: "User created successfully." });
    });
};

const getUserByEmail = (email, callback) => {
    const query = `SELECT id, email, password, role FROM users WHERE email = ?`;

    db.get(query, [email], (err, row) => {
        if (err) {
            callback({ error: 'Error retrieving user.' });
        } else if (row) {
            callback(null, row); // Pass the found user data (row)
        } else {
            callback({ error: 'User not found.' });
        }
    });
};

const getUserBorrowHistory = (req, res) => {
    const userId = req.params.id;

    const query = `
        SELECT bh.id, bh.borrowed_on, bh.returned_on, b.title AS book_title
        FROM borrow_history bh
        JOIN books b ON bh.book_id = b.id
        WHERE bh.user_id = ?
    `;

    db.all(query, [userId], (err, rows) => {
        if (err) {
            console.error("Database query error:", err);
            return res.status(500).json({ error: "Error retrieving borrow history." });
        }

        if (rows.length === 0) {
            return res.status(404).json({ message: "No borrow history found for this user." });
        }

        // Convert Unix timestamps to readable dates
        const formattedRows = rows.map(row => ({
            ...row,
            borrowed_on: new Date(Number(row.borrowed_on)).toISOString().split('T')[0], // Convert to YYYY-MM-DD
            returned_on: new Date(Number(row.returned_on)).toISOString().split('T')[0], // Convert to YYYY-MM-DD
        }));

        res.json(formattedRows);
    });
};


// Correctly export all functions in a single statement
module.exports = {
    createUser,
    getUserByEmail,
    getUserBorrowHistory,
};
