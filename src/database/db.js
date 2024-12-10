const sqlite3 = require('sqlite3').verbose();

// Create or open the SQLite database file
const db = new sqlite3.Database('./library.db', (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create the necessary tables (if they don't exist)
const createTables = () => {
  const createUsersTable = `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
  )`;

  const createBooksTable = `CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    author TEXT,
    quantity INTEGER
  )`;

  const createBorrowRequestsTable = `CREATE TABLE IF NOT EXISTS borrow_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    book_id INTEGER,
    start_date TEXT,
    end_date TEXT,
    status TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(book_id) REFERENCES books(id)
  )`;

  const createBorrowHistoryTable = `CREATE TABLE IF NOT EXISTS borrow_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    book_id INTEGER,
    borrowed_on TEXT,
    returned_on TEXT,
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(book_id) REFERENCES books(id)
  )`;

  db.run(createUsersTable);
  db.run(createBooksTable);
  db.run(createBorrowRequestsTable);
  db.run(createBorrowHistoryTable);
};

// Call the function to create tables
createTables();

module.exports = db;
