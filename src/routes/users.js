const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

// Route to create a user
router.post('/', usersController.createUser);

// Route to get user history
router.get('/:id/history', usersController.getUserHistory);

module.exports = router;
