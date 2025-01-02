const express = require('express');
const cors = require('cors');
const {
  getAllPackages,
  getAllPackagesByDestination,
  addBooking,
  validateBookingInput,
  updateBookingSlot,
  getAllBookingsByPackage,
} = require('./controllers');

const app = express();
app.use(cors());
app.use(express.json());

// retrieve all travel packages
app.get('/packages', (req, res) => {
  const packageDetails = getAllPackages();
  res.status(200).json({ packages: packageDetails });
});

// retrieve travel packages by destination
app.get('/packages/:destination', (req, res) => {
  const destination = req.params.destination;
  const packageDetails = getAllPackagesByDestination(destination);
  res.status(200).json({ package: packageDetails });
});

//  retrieve all booking by pacledId

app.get('/bookings/:packageId', (req, res) => {
  const packageId = parseInt(req.params.packageId);
  const bookings = getAllBookingsByPackage(packageId);
  if (!bookings) {
    return res.status(400).json({ message: 'No bookings found' });
  }

  res.status(200).json({ bookings });
});

// add a new booking
app.post('/bookings', (req, res) => {
  const error = validateBookingInput(req.body);
  if (error) {
    return res.status(400).send(error);
  }

  const booking = addBooking(req.body);
  res.status(201).json({ booking });
});

// update
app.post('/packages/update-seats', (req, res) => {
  const { packageId, seatsBooked } = req.body;
  const packageDetails = updateBookingSlot(packageId, seatsBooked);
  res.status(201).json({ package: packageDetails });
});

module.exports = { app };
