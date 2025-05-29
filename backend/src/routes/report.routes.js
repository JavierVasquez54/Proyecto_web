// backend/src/routes/report.routes.js
const express = require('express');
const reportController = require('../controllers/report.controller');
const verifyToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const router = express.Router();

// Admin routes - Requires authentication and admin role
router.get('/activity', verifyToken, isAdmin, reportController.getActivityReport);

module.exports = router;