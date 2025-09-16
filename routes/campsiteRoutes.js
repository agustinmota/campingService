const express = require('express');

const CampsiteControllers = require('../controllers/CampsiteControllers');
const router = express.Router();
router.use(require('../middlewares/authMiddleware'));
const authMiddleware = require('../middlewares/authMiddleware');
const authorizedRoles = require('../middlewares/authorizedRoles');


router.get('/',CampsiteControllers.index);
router.get('/show/:id', CampsiteControllers.show);
router.use(authMiddleware);
router.post('/create', authorizedRoles('admin'), CampsiteControllers.create);
router.put('/edit/:id', authorizedRoles('admin'), CampsiteControllers.edit);
router.delete('/delete/:id', authorizedRoles('admin'), CampsiteControllers.destroy);

module.exports = router;