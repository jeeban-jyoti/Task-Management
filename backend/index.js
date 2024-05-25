const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// In-memory data storage
let tasks = [];

app.use(bodyParser.json());
app.use(cors());

// GET all tasks
app.get('/tasks', (req, res) => {
  res.json(tasks);
});

// GET a single task by ID
app.get('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(task => task.id === taskId);

  if (!task) {
    res.status(404).json({ error: 'Task not found' });
  } else {
    res.json(task);
  }
});

// POST create a new task
app.post('/tasks', (req, res) => {
  const newTask = req.body;
  newTask.id = generateUniqueId();
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT update an existing task by ID
app.put('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const updatedTask = req.body;

  const index = tasks.findIndex(task => task.id === taskId);
  if (index === -1) {
    res.status(404).json({ error: 'Task not found' });
  } else {
    tasks[index] = { ...tasks[index], ...updatedTask };
    res.json(tasks[index]);
  }
});

// DELETE a task by ID
app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const index = tasks.findIndex(task => task.id === taskId);

  if (index === -1) {
    res.status(404).json({ error: 'Task not found' });
  } else {
    tasks.splice(index, 1);
    res.status(204).send();
  }
});

// Helper function to generate unique ID
function generateUniqueId() {
  let id;
  do {
    id = '_' + Math.random().toString(36).substr(2, 9);
  } while (tasks.some(task => task.id === id));
  return id;
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
