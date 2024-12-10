const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const createTables = require('./database/schema');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const borrowRoutes = require('./routes/borrowRoutes');

const app = express();
app.use(cors());
app.use(express.json());

createTables();

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/borrow-requests', borrowRoutes);


app.get('/', (req, res) => {
    res.send("Welcome to the Library Management System!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
