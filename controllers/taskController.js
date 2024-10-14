// controllers/taskController.js
const Task = require('../models/task');
const User = require('../models/user');

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.session.userId) {
    return next();
  } else {
    res.redirect('/auth/login');
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  if (!req.session.userId) return res.redirect('/auth/login');

  try {
    const tasks = await Task.find({ user: req.session.userId }).sort({ createdAt: -1 });
    console.log('Fetched tasks:', tasks); // Log fetched tasks
    const user = await User.findById(req.session.userId);
    res.render('index', { tasks, title: 'All Tasks', user });
  } catch (err) {
    console.log(err);
    res.status(500).send('An error occurred while fetching tasks');
  }
};

// Show form to create a new task
const showCreateTaskForm = (req, res) => {
  res.render('create', { title: 'Create a New Task' });
};

// Create a new task
const createTask = async (req, res) => {
  try {
    const task = new Task({
      ...req.body,
      user: req.session.userId
    });
    await task.save();
    console.log('Task created:', task); // Log to confirm task creation
    res.redirect('/tasks');
  } catch (err) {
    console.log(err);
    res.status(500).send('An error occurred while creating the task');
  }
};

// Mark task as complete
const completeTask = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Task.findOneAndUpdate(
      { _id: id, user: req.session.userId },
      { completed: true },
      { new: true }
    );
    if (!result) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }
    res.json({ redirect: '/tasks' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while completing the task' });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const id = req.params.id;
  try {
    const result = await Task.findOneAndDelete({ _id: id, user: req.session.userId });
    if (!result) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }
    res.json({ redirect: '/tasks' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'An error occurred while deleting the task' });
  }
};

module.exports = { ensureAuthenticated, getAllTasks, showCreateTaskForm, createTask, completeTask, deleteTask };
