// Load .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const app = express();
const { Client } = require('pg');
const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

// Connect
client.connect((err) => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected');
  }
});

// Cors allow, parsing
app.use(cors());
app.use(express.json());

// List
app.get('/api/books', async (req, res) => {
  const list = await client.query('SELECT * FROM public.books');
  res.send(list.rows);
});

// Create
app.post('/api/books', async (req, res) => {
  // const list = await client.query('SELECT * FROM public.books');
  const book = await client.query(
    `INSERT INTO public.books(title,author,read) VALUES ('${req.body.title}', '${req.body.author}', ${req.body.read});`
  );
  console.log(book);
  res.send(); 
});

// Read
app.get('/api/book/:id', async (req, res) => {
  res.send();
});

// Update
app.put('/api/books/:id', async (req, res) => {
  const _id = req.params.id;
  const book = await client.query(
    `UPDATE public.books
    SET title = '${req.body.title}', author = '${req.body.author}', read = ${req.body.read}
    WHERE id = ${_id};`
  );
  res.send();
});

// Delete
app.delete('/api/books/:id', async (req, res) => {
  const _id = req.params.id;
  const book = await client.query(
    `DELETE FROM public.books WHERE "id"=${_id};`
  );
  res.send();
});

// Assign Port
const port = process.env.PORT || 5000;

// Listen for incoming requests
app.listen(port);

// Output to stdout
console.log('Server started ' + port);
