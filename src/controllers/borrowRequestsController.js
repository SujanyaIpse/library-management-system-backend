const db = require('../database/db'); // Path to your DB connection file

const approveBorrowRequest = (req, res) => {
    const { id } = req.params; // Extract the ID from the request parameter
  
    const query = `SELECT * FROM borrow_requests WHERE id = ?`;
    db.get(query, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error occurred' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Borrow request not found' });
      }
  
      // Check if the book is already in borrow history (if it’s been borrowed)
      const historyQuery = `SELECT * FROM borrow_history WHERE user_id = ? AND book_id = ? AND returned_on IS NULL`;
      db.get(historyQuery, [row.user_id, row.book_id], (err, historyRow) => {
        if (err) {
          return res.status(500).json({ error: 'Error checking borrow history' });
        }
        if (historyRow) {
          return res.status(400).json({ error: 'This book is already borrowed by the user.' });
        }
  
        // Update the borrow request status to 'approved'
        const updateQuery = `UPDATE borrow_requests SET status = 'approved' WHERE id = ?`;
        db.run(updateQuery, [id], function (err) {
          if (err) {
            return res.status(500).json({ error: 'Error updating borrow request' });
          }
  
          // Insert into borrow history once approved
          const insertHistoryQuery = `
              INSERT INTO borrow_history (user_id, book_id, borrowed_on)
              VALUES (?, ?, datetime('now'))
          `;
          db.run(insertHistoryQuery, [row.user_id, row.book_id], function (err) {
            if (err) {
              return res.status(500).json({ error: 'Error adding to borrow history' });
            }
            res.status(200).json({ message: 'Borrow request approved and history updated successfully' });
          });
        });
      });
    });
  };
  

// Function to deny a borrow request
const denyBorrowRequest = (req, res) => {
    const borrowRequestId = req.params.id;

    const query = `UPDATE borrow_requests SET status = 'Denied' WHERE id = ?`;

    db.run(query, [borrowRequestId], function (err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: "Error denying borrow request." });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: "Borrow request not found." });
        }
        res.status(200).json({ message: "Borrow request denied." });
    });
};

module.exports = { approveBorrowRequest, denyBorrowRequest };
