const express = require('express');

const CabinControllers = require('../controllers/CabinControllers');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/authorizedRoles');
router.get('/', CabinControllers.index);
router.get('/show/:id', CabinControllers.show);
router.use(authMiddleware);
router.post('/edit/:id', authorizedRoles('admin'), CabinControllers.edit);
router.delete('/delete/:id', authorizedRoles('admin'), CabinControllers.destroy);
router.post('/create', authorizedRoles('admin'), CabinControllers.create);

module.exports = router;