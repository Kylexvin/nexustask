const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Define the user schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save hook to hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Only hash if the password is new or modified
  try {
    const saltRounds = 10; // Define salt rounds for hashing
    this.password = await bcrypt.hash(this.password, saltRounds);
    next(); // Proceed to save the user
  } catch (error) {
    console.error('Error hashing password:', error); // Log error if hashing fails
    next(error); // Pass the error to the next middleware
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const match = await bcrypt.compare(candidatePassword, this.password); // Compare provided password with stored hash
    return match; // Return the result of comparison
  } catch (error) {
    console.error('Error comparing password:', error); // Log error if comparison fails
    throw error; // Rethrow the error for handling in the calling function
  }
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
