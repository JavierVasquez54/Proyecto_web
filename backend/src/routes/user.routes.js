const express = require('express');
const userController = require('../controllers/user.controller');
const verifyToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

// Admin routes
router.get('/', verifyToken, isAdmin, userController.getAllUsers);
router.patch('/:id/status', verifyToken, isAdmin, userController.toggleUserStatus);

module.exports = router;