
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Aiven MySQL connection
const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 25138),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,

  ssl: {
    ca: process.env.DB_CA_CERT,
    servername: 'mysql-1b2a3de7-jancymani17-4168.a.aivencloud.com'
  },

  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Check MySQL connection
db.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection failed:', err.message);
    return;
  }

  console.log('Aiven MySQL connected successfully!');
  connection.release();
});

// Test API
app.get('/', (req, res) => {
  res.send('Quiz API is running!');
});

// Get questions by category
app.get('/questions', (req, res) => {
  const category = req.query.category;

  let sql = 'SELECT * FROM questions';
  const params = [];

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

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
