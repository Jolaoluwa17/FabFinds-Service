const request = require('supertest');
const express = require('express');
const app = require('../server');
const mongoose = require('mongoose');

describe('GET /', () => {
  it('should return "Server running"', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Server Running');
  });
});

afterAll(async () => {
  await mongoose.connection.close(); // Close MongoDB connection
}, 10000);
