const db = require('../database/db');

const createBorrowRequest = (req, res) => {
    const { user_id, book_id, start_date, end_date, status } = req.body;
    
    if (!user_id || !book_id || !start_date || !end_date || !status) {
        return res.status(400).json({ error: "All fields are required." });
    }

    // Insert into borrow_requests table
    const query = `INSERT INTO borrow_requests (user_id, book_id, start_date, end_date, status)
                   VALUES (?, ?, ?, ?, ?)`;
    
    db.run(query, [user_id, book_id, start_date, end_date, status], function (err) {
        if (err) {
            return res.status(500).json({ error: 'Error creating borrow request.' });
        }

        // After successfully creating the borrow request, insert into borrow_history
        const borrowHistoryQuery = `INSERT INTO borrow_history (user_id, book_id, borrowed_on, returned_on)
                                    VALUES (?, ?, ?, ?)`;

        const borrowed_on = new Date(); // Set the borrowed_on as current date
        const returned_on = new Date(end_date); // Set returned_on as end date or your desired logic

        db.run(borrowHistoryQuery, [user_id, book_id, borrowed_on, returned_on], function (err) {
            if (err) {
                return res.status(500).json({ error: 'Error inserting into borrow history.' });
            }

            // Log the insertion result
            console.log(`Inserted into borrow_history: user_id=${user_id}, book_id=${book_id}, borrowed_on=${borrowed_on}, returned_on=${returned_on}`);

            // Send success response for the borrow request and borrow history
            res.status(201).json({
                message: 'Borrow request and borrow history created successfully.',
                borrowRequestId: this.lastID,
                borrowHistoryId: this.lastID // lastID will be the ID of the most recently inserted row
            });
        });
    });
};

module.exports = { createBorrowRequest };
