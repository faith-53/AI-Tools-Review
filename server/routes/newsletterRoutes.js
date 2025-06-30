const express = require('express');
const router = express.Router();
const { signup, confirm, getAll, delete: deleteSignup } = require('../controllers/newsletterController');
const { protect } = require('../middlewares/auth');

router.post('/', signup);
router.get('/confirm', confirm);
router.get('/all', protect, getAll);
router.delete('/:id', protect, deleteSignup);

module.exports = router; 