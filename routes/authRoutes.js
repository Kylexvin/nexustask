const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Show registration form
router.get('/register', (req, res) => {
  const error = req.query.error || null; // Get error message from query
  res.render('register', { title: 'Register', error });
});

// Handle registration
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.redirect('/auth/register?error=User already exists');
    }

    const user = new User({ username, password });
    await user.save();
    res.redirect('/auth/login'); // Redirect to login after successful registration
  } catch (err) {
    console.log(err);
    res.redirect('/auth/register'); // Redirect back to register on error
  }
});

// Show login form
router.get('/login', (req, res) => {
  const error = req.query.error || null; // Get error message from query
  res.render('login', { title: 'Login', error });
});

// Handle login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await User.findOne({ username });
    if (user) {
      console.log('User found:', user); // Debug: Check if user is found
      const isMatch = await user.comparePassword(password);
      console.log('Password match:', isMatch); // Debug: Check if password matches
      if (isMatch) {
        req.session.userId = user._id; // Store user ID in session
        return res.redirect('/tasks'); // Redirect to tasks on successful login
      }
    }
    res.redirect('/auth/login?error=Invalid username or password'); // Redirect back to login on error
  } catch (err) {
    console.log(err);
    res.redirect('/auth/login'); // Redirect back to login on error
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/auth/login'); // Redirect to login after logout
  });
});

module.exports = router;
