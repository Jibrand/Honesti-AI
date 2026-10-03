import test from 'node:test';
import assert from 'node:assert';
import request from 'supertest';
import app, { server } from './index.js';
import db from './db.js';

test('Auth API (Day 1)', async (t) => {
  // Cleanup before tests
  await db.query('DELETE FROM users WHERE email = $1', ['test@example.com']);

  await t.test('✅ should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });
    assert.strictEqual(res.status, 201);
    assert.strictEqual(res.body.message, 'User created successfully');
    console.log('✅ should register a new user successfully');
  });

  await t.test('❌ should not register an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@example.com', password: 'password123' });
    assert.strictEqual(res.status, 409);
    console.log('❌ should not register an existing user');
  });

  await t.test('✅ should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'password123' });
    assert.strictEqual(res.status, 200);
    assert.ok(res.body.token);
    console.log('✅ should login with correct credentials');
  });

  await t.test('❌ should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com', password: 'wrongpassword' });
    assert.strictEqual(res.status, 401);
    console.log('❌ should fail login with wrong password');
  });

  // Cleanup after tests
  await db.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
  server.close();
});
