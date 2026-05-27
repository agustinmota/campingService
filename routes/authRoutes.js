const express = require('express');

const AuthControllers = require('../controllers/AuthController');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/authorizedRoles');


router.post('/login', AuthControllers.login);

module.exports = router;