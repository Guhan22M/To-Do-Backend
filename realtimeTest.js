console.log("started");

const { io } = require('socket.io-client');

const socket = io('http://localhost:5000');

const userId = '685e9cf7edc5c23e223f9c0b'; 

socket.on('connect', () => {
  console.log('✅ Connected to server with ID:', socket.id);

  socket.emit('join', userId);
});

// Listen for real-time task events
socket.on('taskCreated', (data) => {
  console.log('📌 Task Created:', data);
});

socket.on('taskUpdated', (data) => {
  console.log('✏️ Task Updated:', data);
});

socket.on('taskDeleted', (taskId) => {
  console.log('🗑️ Task Deleted:', taskId);
});
