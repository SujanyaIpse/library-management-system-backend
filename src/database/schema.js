const db = require('./db');

const createTables = () => {
    db.serialize(() => {
        // Create Users table
        db.run(
            `
            CREATE TABLE IF NOT EXISTS Users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role TEXT CHECK(role IN ('Librarian', 'User')) NOT NULL
            );
            `,
            (err) => {
                if (err) {
                    console.error("Error creating Users table:", err.message);
                } else {
                    console.log("Users table created or already exists.");
                }
            }
        );

        // Create Books table
        db.run(
            `
            CREATE TABLE IF NOT EXISTS Books (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                author TEXT NOT NULL,
                quantity INTEGER NOT NULL
            );
            `,
            (err) => {
                if (err) {
                    console.error("Error creating Books table:", err.message);
                } else {
                    console.log("Books table created or already exists.");
                }
            }
        );

        // Create BorrowRequests table
        db.run(
            `
            CREATE TABLE IF NOT EXISTS BorrowRequests (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                book_id INTEGER NOT NULL,
                start_date TEXT NOT NULL,
                end_date TEXT NOT NULL,
                status TEXT CHECK(status IN ('Pending', 'Approved', 'Denied')) NOT NULL,
                FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
                FOREIGN KEY (book_id) REFERENCES Books (id) ON DELETE CASCADE
            );
            `,
            (err) => {
                if (err) {
                    console.error("Error creating BorrowRequests table:", err.message);
                } else {
                    console.log("BorrowRequests table created or already exists.");
                }
            }
        );

        // Create BorrowHistory table
        db.run(
            `
            CREATE TABLE IF NOT EXISTS BorrowHistory (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                book_id INTEGER NOT NULL,
                borrowed_on TEXT NOT NULL,
                returned_on TEXT,
                FOREIGN KEY (user_id) REFERENCES Users (id) ON DELETE CASCADE,
                FOREIGN KEY (book_id) REFERENCES Books (id) ON DELETE CASCADE
            );
            `,
            (err) => {
                if (err) {
                    console.error("Error creating BorrowHistory table:", err.message);
                } else {
                    console.log("BorrowHistory table created or already exists.");
                }
            }
        );

        console.log("All database tables checked/created successfully.");
    });
};

module.exports = createTables;
