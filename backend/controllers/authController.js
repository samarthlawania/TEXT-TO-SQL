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

// @desc    Authenticate a user and get token
// @route   POST /api/login
// @access  Public
exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the user exists
    let user = await User.findOne({ where: { username } });

    // If not, create a new user (for demo purposes)
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      user = await User.create({ username, password: hashedPassword });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      res.status(200).json({
        message: 'Login successful!',
        token: generateToken(user.id),
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};