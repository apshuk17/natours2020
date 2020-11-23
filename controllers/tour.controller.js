const Tour = require('../models/tour.models');
const { filteredQuery, parsedQueryString } = require('../utils/utils');

// Route handlers
exports.getAllTours = async (req, res) => {
  // Build Query
  // 1a) Filtering
  const queryObj = filteredQuery({ ...req.query }, [
    'sort',
    'page',
    'limit',
    'fields',
  ]);

  // 1b) Advanced Filtering
  const queryString = parsedQueryString(JSON.stringify(queryObj));

  let query = Tour.find(JSON.parse(queryString));

  // 2) Sorting
  if (req.query && req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }

  // Execute Query
  try {
    const tours = await query;
    res
      .status(200)
      .json({ status: 'success', message: { results: tours.length, tours } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.createTour = async (req, res) => {
  try {
    const tour = await Tour.create(req.body);
    res.status(201).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(400).json({ status: 'fail', message: err });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: { tour } });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({ status: 'fail', message: err });
  }
};
