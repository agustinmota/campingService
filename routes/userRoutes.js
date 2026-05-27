const express = require('express');
const UserControllers = require('../controllers/UserControllers');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/authorizedRoles');



router.post('/create', UserControllers.create);
router.use(authMiddleware);
router.get('/index', authorizedRoles('admin'), UserControllers.index);
router.get('/show/:id',  authorizedRoles('admin'), UserControllers.show);
router.put('/edit/:id', UserControllers.edit);
router.delete('/delete/:id', authorizedRoles('admin'), UserControllers.destroy);

module.exports = router;
