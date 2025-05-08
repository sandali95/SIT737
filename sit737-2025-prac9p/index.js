const express = require("express");
const path = require("path");
const winston = require("winston");
const mongoose = require("mongoose");

const app = express();

// 1) Connect to MongoDB
if (!process.env.MONGO_URI) {
  throw new Error("Please specify the MongoDB URI with MONGO_URI.");
}
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error(" MongoDB connection error:", err);
    process.exit(1);
  });

// 2) Define a Task model
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
}, { timestamps: true });

const Task = mongoose.model("Task", taskSchema);

// 3) Basic middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const viewsPath = path.join(__dirname, "views");

// 4) Routes

// Home page
app.get("/home", (req, res) => {
  res.sendFile(path.join(viewsPath, "home.html"));
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// --- New API endpoints for CRUD on tasks ---

// Fetch all tasks
app.get("/api/tasks", async (req, res, next) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// Create a new task
app.post("/api/tasks", async (req, res, next) => {
  try {
    const { text } = req.body;
    const newTask = await Task.create({ text });
    res.status(201).json(newTask);
  } catch (err) {
    next(err);
  }
});

// Toggle completed
app.patch("/api/tasks/:id", async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    task.completed = !task.completed;
    await task.save();
    res.json(task);
  } catch (err) {
    next(err);
  }
});

// Delete a task
app.delete("/api/tasks/:id", async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

// 5) Winston logger & error handlers

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/error.log" }),
  ],
});

app.use((err, req, res, next) => {
  logger.error(`500 - ${err.message}`);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.use((req, res) => {
  logger.warn(`404 - Not Found: ${req.method} ${req.url}`);
  res.status(404).json({ error: "Not Found", message: "Resource does not exist." });
});

// 6) Listen
if (!process.env.PORT) {
  throw new Error("Please specify PORT.");
}
app.listen(process.env.PORT, () =>
  console.log(`Server listening on port ${process.env.PORT}`)
);
