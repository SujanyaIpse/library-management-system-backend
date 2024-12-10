const db = require('../database/db');

// Function to create a user
const createUser = (req, res) => {
  const { email, password, role } = req.body;

  // Check if the fields are provided
  if (!email || !password || !role) {
    return res.status(400).json({ error: "Email, password, and role are required." });
  }

  const query = `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`;
  
  db.run(query, [email, password, role], function (err) {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: "Error creating user." });
    }
    res.status(201).json({ message: "User created successfully", userId: this.lastID });
  });
};

// Function to get user by ID (for borrow history)
const getUserHistory = (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM borrow_history WHERE user_id = ?`;

  db.all(query, [userId], (err, rows) => {
    if (err) {
      console.error('Database error:', err.message);
      return res.status(500).json({ error: "Error fetching user history." });
    }
    res.status(200).json(rows);
  });
};

module.exports = { createUser, getUserHistory };
