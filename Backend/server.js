const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/*
--------------------------
(1) READ: Get all books
--------------------------
*/

app.get("/books", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM books ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/*
-----------------------------------
(2) CREATE: Here we add a new book
-----------------------------------
*/

app.post("/books", async (req, res) => {
  const { title, author, genre, publication_date, description } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO books (title, author, genre, publication_date, description) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, author, genre, publication_date, description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/*
-----------------------------------
(3) UPDATE: Here we update a book
-----------------------------------
*/

app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, publication_date, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE books SET title=$1, author=$2, genre=$3, publication_date=$4, description=$5 WHERE id=$6 RETURNING *",
      [title, author, genre, publication_date, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

/*
-----------------------------------
(4) DELETE: Here we delete a book
-----------------------------------
*/

app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, author, genre, publication_date, description } = req.body;
  try {
    const result = await pool.query(
      "UPDATE books SET title=$1, author=$2, genre=$3, publication_date=$4, description=$5 WHERE id=$6 RETURNING *",
      [title, author, genre, publication_date, description, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
