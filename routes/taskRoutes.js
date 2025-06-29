const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  shareTask
} = require('../controllers/taskController');

router.route('/')
  .get(protect, getTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTask)
  .delete(protect, deleteTask);

router.post('/share/:id', protect, shareTask);

module.exports = router;
