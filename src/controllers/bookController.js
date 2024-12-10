const db = require('../database/db');

const getAllBooks = (req, res) => {
    const query = `SELECT * FROM Books`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: "Error retrieving books." });
        }
        res.status(200).json(rows);
    });
};

const addBook = (req, res) => {
    const { title, author, quantity } = req.body;

    if (!title || !author || !quantity) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    const query = 'INSERT INTO books (title, author, quantity) VALUES (?, ?, ?)';
    db.run(query, [title, author, quantity], function(err) {
        if (err) {
            return res.status(500).json({ error: 'Error adding book.' });
        }
        res.status(201).json({ message: 'Book added successfully.' });
    });
};


module.exports = { addBook, getAllBooks };
