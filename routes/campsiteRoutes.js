const express = require('express');

const CampsiteControllers = require('../controllers/CampsiteControllers');
const router = express.Router();

router.get('/index',CampsiteControllers.index);
router.get('/show/:id', CampsiteControllers.show);
router.post('/create', CampsiteControllers.create);
router.put('/edit/:id', CampsiteControllers.edit);
router.delete('/delete/:id', CampsiteControllers.destroy);

module.exports=router;