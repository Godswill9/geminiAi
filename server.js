require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const path = require("path");
const carRequest = require("./routes/car")


const io = socketIO(server, {
  cors: {
    origin: [
      "http://localhost:5172",
      "http://127.0.0.1:5500",
       "https://gemini-asoro.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization"], // Ensure necessary headers are allowed
  }
});

// Middlewares for static files and other configurations
app.use(express.static('build'));

app.use(
  cors({
    origin: [
      "http://localhost:5172",
      "http://127.0.0.1:5500",
      "https://gemini-asoro.netlify.app"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    // allowedHeaders: ["Content-Type", "Authorization"], // Ensure necessary headers are allowed
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

// Routes for the API
app.get("/", (req, res) => {
  res.send("welcome to asoroai2 backend system...");
});

app.use('/api', carRequest)


// WebSocket handling: Real-time messaging
io.on('connection', (socket) => {
  console.log('A user connected');

  // Listen for incoming messages from clients
  socket.on('send_message', (message) => {
    console.log('Received message:', message);

    // Broadcast the message to all connected clients
    io.emit('receive_message', message); // Send to all clients
  });

  // Handle client disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});

// Set the port to listen on
const port = process.env.PORT || 8087;
console.log(new Date());

// Start the server with WebSocket
server.listen(port, () => {
  console.log("Server is running on port", port);
});