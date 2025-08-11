const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../db');
const config = require('../config');

// Function to generate a JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, config.jwtSecret, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

exports.registerUser = async (req, res) => {
    // 1. Extract user data from the request body
    const { username, email, password } = req.body;

    // 2. Perform basic validation (e.g., check if fields are not empty)
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // 3. Check if a user with the same email already exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        // 4. Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // 5. Create a new user in the database
        const newUser = await User.create({
            username,
            email,
            password_hash
        });

        // 6. Return a success response (excluding the password hash)
        res.status(201).json({
            message: 'User registered successfully',
            user: {
                user_id: newUser.user_id,
                username: newUser.username,
                email: newUser.email,
            }
        });

    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};
exports.loginUser = async (req, res) => {
    const { username,email, password } = req.body;
console.log('Login attempt with email:', email);
console.log('Login attempt with password:', password);
    try {
        // 1. Find the user by email
        const user = await User.findOne({ where: { email } });

        // 2. IMPORTANT: Check if the user exists before proceeding
        if (!user) {
            console.log('Login attempt with non-existent email:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // 3. Now that we know the user exists, we can safely compare passwords
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            console.log('Login attempt with incorrect password for user:', email);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Password matches, handle successful login
        // ... create and send a token, etc.
        res.status(200).json({ message: 'Login successful' });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};