const User = require('../models/user');
const bcrypt = require('bcrypt');

// Show registration form
const showRegisterForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

// Handle user registration
const registerUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.redirect('/auth/login');
  } catch (err) {
    console.log(err);
    if (err.code === 11000) { // Duplicate username
      return res.redirect('/auth/register?error=User already exists');
    }
    res.redirect('/auth/register');
  }
};

// Show login form
const showLoginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

// Handle user login
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  console.log("Logging in user:", username); // Log the username
  try {
    const user = await User.findOne({ username });
    if (user && await user.comparePassword(password)) {
      req.session.userId = user._id;
      return res.redirect('/tasks');
    }
    console.log("Invalid login credentials"); // Log invalid login
    res.redirect('/auth/login');
  } catch (err) {
    console.log(err);
    res.redirect('/auth/login');
  }
};

// Handle user logout
const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.log(err);
      res.redirect('/tasks');
    } else {
      res.redirect('/auth/login');
    }
  });
};

module.exports = { showRegisterForm, registerUser, showLoginForm, loginUser, logoutUser };
