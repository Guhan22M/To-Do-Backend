const path = require('path');
const express = require('express');
const colors = require('colors');
const dotenv = require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const { errorHandler } = require('./middleware/errorMiddleware');
const connectDB = require('./config/db');

const port = process.env.PORT || 5000;

// DB Connection
connectDB();

// Init app
const app = express();

const cors = require('cors');
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Session for Passport (must be before passport middleware)
app.use(
  session({
    secret: 'keyboard cat', // you can move this to .env
    resave: false,
    saveUninitialized: false,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Load Passport strategies
require('./config/passport'); // You MUST create this

// Routes
app.use('/api/users', require('./routes/userRoutes')); 
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/auth', require('./routes/authRoutes')); 

// Serve frontend
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build')));
  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../', 'frontend', 'build', 'index.html'))
  );
} else {
  app.get('/', (req, res) => res.send('Please set NODE_ENV=production'));
}

// Error handler
app.use(errorHandler);

//socket.io

const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST','PUT','DELETE'],
  },
});

// Store io globally
app.set('io', io);


// Handle connections
io.on('connection', (socket) => {
  console.log('🟢 Socket connected:', socket.id);

  socket.on('join', (userId) => {
    socket.join(userId); // Each user has their own room
    console.log(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('🔴 Socket disconnected:', socket.id);
  });
});

// Start server with socket.io
server.listen(port, () => console.log(`🚀 Server + Socket.IO running on port ${port}`));
