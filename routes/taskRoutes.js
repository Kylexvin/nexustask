// routes/task.js
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// Ensure authentication middleware
const ensureAuthenticated = taskController.ensureAuthenticated;

// Task routes
router.get('/', ensureAuthenticated, taskController.getAllTasks);
router.get('/create', ensureAuthenticated, taskController.showCreateTaskForm);
router.post('/', ensureAuthenticated, taskController.createTask);
router.delete('/:id', ensureAuthenticated, taskController.deleteTask);
router.patch('/:id/complete', ensureAuthenticated, taskController.completeTask);

module.exports = router;
