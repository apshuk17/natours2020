const express = require('express');
const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
} = require('../controllers/user.controller');
const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updateMyPassword,
  protect,
} = require('../controllers/auth.controller');

const router = express.Router();

// Auth routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);
router.patch('/updatemypassword', protect, updateMyPassword);

// User update
router.patch('/updateme', protect, updateMe);
router.delete('/deleteme', protect, deleteMe);

// API Routes
router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
