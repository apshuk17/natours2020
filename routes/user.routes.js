const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/user.controller');
const { signup, login } = require('../controllers/auth.controller');

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);

// API Routes
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
