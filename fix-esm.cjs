import fs from 'fs';

// Since this script is run by node, and the package might be type: module
// Wait, I am running this script using node fix-esm.js. If package.json is type module, I can just use ESM here.

const indexJS = `import express from "express";
import mongoose from "mongoose";
import cors from "cors";  
import contactRoutes from "./Routes/contact.js";
import authRoutes from "./Routes/auth.js";
import dotenv from "dotenv";

dotenv.config();
const PORT = 3001;
const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => res.status(200).send("Hello world"));

app.use("/api", contactRoutes);
app.use("/api/auth", authRoutes);

const CONNECTION_URL = process.env.CONNECTION_URL;
if (CONNECTION_URL) {
  mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true,}).then(() => { console.log('Connected Successfully.'); }) .catch((err) => console.log('No connection ', err));
}

export const server = app.listen(PORT, () => console.log("Listening on port ", PORT));
export default app;
`;
fs.writeFileSync('backend/index.js', indexJS);

const dbJS = `import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const initDb = async () => {
  try {
    await pool.query(\`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    \`);
    console.log('Database connected and initialized.');
  } catch (err) {
    console.error('Database initialization error:', err);
  }
};

initDb();

export const query = (text, params) => pool.query(text, params);
export default { query, pool };
`;
fs.writeFileSync('backend/db.js', dbJS);

const authJS = `import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await db.query(
      'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashedPassword]
    );

    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userResult = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = userResult.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });

    res.json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
`;
fs.writeFileSync('backend/Routes/auth.js', authJS);

const authTestJS = `import request from 'supertest';
import app, { server } from '../index.js';
import { pool } from '../db.js';

afterAll(async () => {
  await pool.query('DELETE FROM users WHERE email = $1', ['test@example.com']);
  await pool.end();
  server.close();
});

describe('Auth API (Day 1)', () => {
  it('✅ should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
  });

  it('❌ should not register an existing user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(409);
  });

  it('✅ should login with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('❌ should fail login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword'
      });
    expect(res.statusCode).toEqual(401);
  });
});
`;
fs.writeFileSync('backend/tests/auth.test.js', authTestJS);

// Update package.json test script for ESM Jest
const pkgPath = 'backend/package.json';
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
pkg.scripts.test = 'node --experimental-vm-modules node_modules/jest/bin/jest.js --verbose --detectOpenHandles --forceExit';
fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

console.log('Fixed for ESM successfully.');
