const request = require('supertest');
const http = require('http');
const { app } = require('../index.js');
const { getAllPackages } = require('../controllers');
const { describe } = require('node:test');

jest.mock('../controllers', () => ({
  ...jest.requireActual('../controllers'),
  getAllPackages: jest.fn(),
}));

let server;

beforeAll((done) => {
  server = http.createServer(app);
  server.listen(3010, done);
});

afterAll((done) => {
  server.close(done);
});

describe('API Endpoints testing', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /packages should retrieve all packages', async () => {
    const mockPackages = [
      {
        packageId: 1,
        destination: 'Paris',
        price: 1500,
        duration: 7,
        availableSlots: 10,
      },
      {
        packageId: 2,
        destination: 'Rome',
        price: 1200,
        duration: 5,
        availableSlots: 15,
      },
      {
        packageId: 3,
        destination: 'Tokyo',
        price: 2000,
        duration: 10,
        availableSlots: 8,
      },
    ];

    getAllPackages.mockReturnValue(mockPackages);

    const result = await request(server).get('/packages');
    expect(result.status).toBe(200);
    expect(result.body.packages).toEqual(mockPackages);
  });

  it('GET /packages/:destination should return the travelPackages of specified destination', async () => {
    const result = await request(server).get('/packages/paris');
    expect(result.status).toBe(200);
    expect(result.body).toEqual({
      package: [
        {
          packageId: 1,
          destination: 'Paris',
          price: 1500,
          duration: 7,
          availableSlots: 10,
        },
      ],
    });
  });

  it('POST /bookings endpoint adds a valid booking data', async () => {
    const res = await request(server).post('/bookings').send({
      packageId: 4,
      customerName: 'Raj Kulkarni',
      bookingDate: '2024-12-20',
      seats: 2,
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      booking: {
        bookingId: 6,
        packageId: 4,
        customerName: 'Raj Kulkarni',
        bookingDate: '2024-12-20',
        seats: 2,
      },
    });
  });

  it('POST /packages/seats-update  should update the available slots', async () => {
    const res = await request(server).post('/packages/update-seats').send({
      packageId: 1,
      seatsBooked: 2,
    });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      package: {
        packageId: 1,
        destination: 'Paris',
        price: 1500,
        duration: 7,
        availableSlots: 2,
      },
    });
  });

  it('GET /bookings/:packageId should retrieve all booking for a specifie package', async () => {
    const res = await request(server).get('/bookings/1');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      bookings: [
        {
          bookingId: 1,
          packageId: 1,
          customerName: 'Anjali Seth',
          bookingDate: '2024-12-01',
          seats: 2,
        },
      ],
    });
  });
});
