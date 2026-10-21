
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '123456',
  database: 'quizdb'
});

db.connect((err) => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    return;
  }

  console.log('MySQL connected successfully!');
});

// Test route
app.get('/', (req, res) => {
  res.send('Quiz API is running!');
});

// Get questions by category
app.get('/questions', (req, res) => {
  const category = req.query.category;
  console.log('Selected category:', category);

  let sql = 'SELECT * FROM questions';
  let params = [];

  if (category) {
    sql += ' WHERE category = ?';
    params.push(category);
  }

  sql += ' ORDER BY id ASC';

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error('Query failed:', err.message);
      return res.status(500).json({
        error: 'Failed to fetch questions'
      });
    }

    res.json(results);
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
