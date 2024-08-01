const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

// Replace this with a valid token if needed
const validToken = 'your-valid-jwt-token';

beforeAll(async () => {
  // Seed the database with sample users
  await User.insertMany([
    {
      name: 'jodiz Doe',
      email: 'jodiz.doe@example.com',
      phoneNo: '1234567890', // Add a phone number if required
      password: 'hashedpassword', // Use a hashed password if applicable
      roles: { Admin: 5150 }, // Set the Admin role
      isVerified: true,
    },
    {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phoneNo: '0987654321', // Add a phone number if required
      password: 'hashedpassword', // Use a hashed password if applicable
      roles: { User: 2003 }, // Set the User role
      isVerified: true,
    },
  ]);
});

describe('GET /user', () => {
  it('should return a list of users', async () => {
    const res = await request(app).get('/user');
    //   .set('Authorization', `Bearer ${validToken}`); // Set the authorization header if required

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('name');
    expect(res.body[0]).toHaveProperty('email');
    expect(res.body[0]).toHaveProperty('roles');
    expect(res.body[0]).toHaveProperty('password');
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.connection.close();
}, 10000);
