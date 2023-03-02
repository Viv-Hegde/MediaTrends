"use strict";

const express = require('express');
const app = express();

// other required modules ...
const multer = require("multer");

// for application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

const { Pool } = require('pg');

async function getDBConnection() {
  const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'db07',
    password: 'qwerty',
    port: '5432',
  });

  try {
    const client = await pool.connect();
    console.log('Connected to database');
    return client;
  } catch (error) {
    console.error('Error connecting to database:', error);
    return null;
  }
}

app.get('/hello', async (req, res) => {
  let db = await getDBConnection();
  if (db) {
    let queryText = "SELECT * FROM Shipper";
    let result = await db.query(queryText);
    await db.end();
    res.json({
      "result": result.rows
    });
  }
  res.send('Hello, world!');
});


//front-end is in 'public' folder directory
app.use(express.static('public'));
// Allows us to change the port easily by setting an environment
const PORT = process.env.PORT || 8000;
app.listen(PORT);
