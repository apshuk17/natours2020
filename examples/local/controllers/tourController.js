// const fs = require('fs');
// const path = require('path');

// // Reading data
// const tours = JSON.parse(
//   fs.readFileSync(path.join(__dirname, '..', 'dev-data', 'data', 'tours.json'))
// );

// // Middleware handlers
// exports.checkId = (req, res, next, val) => {
//   const id = val * 1;

//   if (id > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid ID',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body || !req.body.name || !req.body.price) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'Missing name or price',
//     });
//   }
//   next();
// };

// // Route handlers
// exports.getAllTours = (req, res) => {
//   res
//     .status(200)
//     .json({ status: 'success', results: tours.length, data: { tours } });
// };

// exports.createTour = (req, res) => {
//   const newId = tours[tours.length - 1].id + 1;
//   // eslint-disable-next-line node/no-unsupported-features/es-syntax
//   const newTour = { id: newId, ...req.body };

//   tours.push(newTour);
//   fs.writeFile(
//     path.join(__dirname, 'dev-data', 'data', 'tours-simple.json'),
//     JSON.stringify(tours),
//     (err) => {
//       res.status(201).json({
//         status: 'success',
//         data: { tour: newTour },
//       });
//     }
//   );
// };

// exports.getTour = (req, res) => {
//   const id = req.params.id * 1;
//   const tour = tours.find((el) => el.id * 1 === id);

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour,
//     },
//   });
// };

// exports.updateTour = (req, res) => {
//   const id = req.params.id * 1;

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated tour here...>',
//     },
//   });
// };

// exports.deleteTour = (req, res) => {
//   const id = req.params.id * 1;

//   res.status(200).json({
//     status: 'success',
//     data: {
//       tour: '<Updated tour here...>',
//     },
//   });
// };
