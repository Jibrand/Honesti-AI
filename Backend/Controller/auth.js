import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../db.js';

export const register = async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(409).json({ error: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let firstName = '';
    let lastName = '';
    if (fullName) {
      const parts = fullName.split(' ');
      firstName = parts[0];
      lastName = parts.slice(1).join(' ');
    }

    const newUser = await db.query(
      'INSERT INTO users (email, password, "firstName", "lastName") VALUES ($1, $2, $3, $4) RETURNING id, email, "firstName", "lastName"',
      [email, hashedPassword, firstName, lastName]
    );

    res.status(201).json({ message: 'User created successfully', user: newUser.rows[0] });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req, res) => {
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
};


export const getProfile = async (req, res) => {
  try {
    const userResult = await db.query('SELECT id, email, "firstName", "lastName" FROM users WHERE id = $1', [req.user.userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(userResult.rows[0]);
  } catch (error) {
    console.error('Get Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    
    const result = await db.query(
      'UPDATE users SET "firstName" = $1, "lastName" = $2, email = $3 WHERE id = $4 RETURNING id, email, "firstName", "lastName"',
      [firstName, lastName, email, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({ message: 'Profile updated successfully', user: result.rows[0] });
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
