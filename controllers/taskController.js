const asyncHandler = require('express-async-handler');
const Task = require('../models/taskModel');
const User = require('../models/userModel');

// GET /api/tasks
const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({
    $or: [
      { owner: req.user.id },
      { sharedWith: req.user.id }
    ]
  });
  res.status(200).json(tasks);
});

// POST /api/tasks
const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, priority } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    priority,
    owner: req.user.id,
    sharedWith:[],
  });
  const io = req.app.get('io');
  io.to(req.user.id).emit('taskCreated', task);

  res.status(201).json(task);
});

// PUT /api/tasks/:id
const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.owner.toString() !== req.user.id && !task.sharedWith.includes(req.user.id)) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true
  });

  const io = req.app.get('io');

  // Notify owner
  io.to(task.owner.toString()).emit('taskUpdated', updatedTask);

  // Notify all shared users
  task.sharedWith.forEach((userId) => {
    io.to(userId.toString()).emit('taskUpdated', updatedTask);
  });

  res.status(200).json(updatedTask);
});

// DELETE /api/tasks/:id
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  if (task.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Only the owner can delete this task');
  }

  await Task.deleteOne({ _id: task._id });

  const io = req.app.get('io');

  // Notify owner
  io.to(task.owner.toString()).emit('taskDeleted', task._id);

  // Notify shared users
  task.sharedWith.forEach((userId) => {
    io.to(userId.toString()).emit('taskDeleted', task._id);
  });
  res.status(200).json({ message: 'Task deleted' });
});

// POST /api/tasks/share/:id
const shareTask = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const task = await Task.findById(req.params.id);
  const userToShare = await User.findOne({ email });

  if (!task || !userToShare) {
    res.status(404);
    throw new Error('Task or user not found');
  }

  if (task.owner.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Only the owner can share this task');
  }

  if (!task.sharedWith.includes(userToShare._id)) {
    task.sharedWith.push(userToShare._id);
    await task.save();
  }

  res.status(200).json({ message: 'Task shared successfully' });
});

module.exports = {createTask, getTasks, updateTask, deleteTask, shareTask};
