const fs = require('fs');
const path = require('path');

// Reading data
const tours = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'dev-data', 'data', 'tours.json'))
);

// Route handlers
exports.getAllUsers = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route does not exist' });
};

exports.createUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route does not exist' });
};

exports.getUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route does not exist' });
};

exports.updateUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route does not exist' });
};

exports.deleteUser = (req, res) => {
  res
    .status(500)
    .json({ status: 'error', message: 'This route does not exist' });
};
