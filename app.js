const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');

// Load environment variables from .env file
require('dotenv').config();

const app = express();

// MongoDB connection URI from environment variable
const dbURI = process.env.MONGODB_URI;

// Connect to MongoDB
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Start the server once connected to MongoDB
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });

// Middleware setup
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(methodOverride('_method'));
app.use(session({ 
  secret: process.env.SESSION_SECRET, // Use secret from environment variable
  resave: false,
  saveUninitialized: false 
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Root route redirects to /tasks
app.get('/', (req, res) => {
  res.redirect('/tasks');
});

// Route handling
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Handle 404 errors
app.use((req, res) => {
  res.status(404).render('404');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Internal Server Error:', err);
  res.status(500).send('Something broke!');
});

// Export the app module for testing and other uses
module.exports = app;
