const express = require('express');
const mongoose = require('mongoose');
const Todo = require('./Scheme/todoScheme'); 
const app = express();

mongoose.connect('mongodb+srv://nancykaur:komalapp@cluster0.xow1wvb.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.json());

app.post('/todos', async (req, res) => {
    try {
      const newTodo = new Todo({
        title: req.body.title,
        description: req.body.description
      });
      const savedTodo = await newTodo.save();
      res.status(201).json(savedTodo);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

app.get('/todos', async (req, res) => {
    try {
      const todos = await Todo.find();
      res.json(todos);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

  app.get('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (todo) {
        res.json(todo);
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

  app.put('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (todo) {
        todo.title = req.body.title !== undefined ? req.body.title : todo.title;
        todo.description = req.body.description !== undefined ? req.body.description : todo.description;
        todo.completed = req.body.completed !== undefined ? req.body.completed : todo.completed;
        const updatedTodo = await todo.save();
        res.json(updatedTodo);
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  
  app.delete('/todos/:id', async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id);
      if (todo) {
        await todo.remove();
        res.json({ message: 'Deleted Todo' });
      } else {
        res.status(404).json({ message: 'Todo not found' });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

app.use((err, req, res, next) => {
    res.status(500).json({ message: err.message });
  });
  

  const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDB database");
});



app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
