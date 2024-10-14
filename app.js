const express = require('express'); 
const mongoose = require('mongoose'); 
const morgan = require('morgan'); 
const bodyParser = require('body-parser'); 
const methodOverride = require('method-override'); 
const session = require('express-session'); // Import session
const taskRoutes = require('./routes/taskRoutes'); 
const authRoutes = require('./routes/authRoutes'); // Import auth routes

const app = express(); 

// MongoDB connection URI
const dbURI = "mongodb+srv://vinny:Test1234@nodetuts.twc4m.mongodb.net/tasks?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose.connect(dbURI)
  .then(result => app.listen(3000, () => console.log('Server running on port 3000')))
  .catch(err => console.log(err)); 

// Middleware
app.use(express.static('public')); 
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(morgan('dev')); 
app.use(methodOverride('_method')); 
app.use(session({ 
  secret: 'your_secret_key', 
  resave: false, 
  saveUninitialized: false 
})); 
app.set('view engine', 'ejs'); 

// Root route
app.get('/', (req, res) => {
  res.redirect('/tasks'); 
});

// Routes
app.use('/auth', authRoutes); // Use auth routes for all '/auth' requests
app.use('/tasks', taskRoutes); 
