const express = require('express');
const path = require('path');
const mysql = require('mysql2');

const router = express.Router();

// Create a MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Javascript@321',
  database: 'node-complete'
});

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database: ', err);
  } else {
    console.log('Connected to the database');
  }
});

// Route for the homepage
router.get('/', (req, res) => {
  const sqlQuery = "SELECT ID, USERNAME, EMAILID FROM users";

  connection.query(sqlQuery, (error, results) => {
    if (error) {
      // Handle database error
      res.status(500).json({ message: 'Error retrieving user data' });
    } else {
      // Render the homepage and pass the user data to the template
      res.render('index', { users: results });
    }
  });
});

// Route to handle the POST request
router.post('/user/add-user', (req, res) => {
  const { username, emailId, phonenumber } = req.body;
  
  const sqlQuery = "INSERT INTO users (USERNAME, EMAILID, PHONE) VALUES (?, ?, ?)";
  const values = [username, emailId, phonenumber];

  connection.query(sqlQuery, values, (error, results) => {
    if (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Handle duplicate entry error
        res.status(400).json({ message: 'Duplicate entry for email or phone number' });
      } else {
        // Handle other database errors
        res.status(500).json({ message: 'Error adding user to the database' });
      }
    } else {
      // User added successfully
      res.json({ message: 'User added successfully!' });
    }
  });
});

router.delete('/user/delete-user/:id', (req, res) => {
  const userId = req.params.id;

  const query = `DELETE FROM users WHERE id = ${userId}`;
  connection.query(query, [userId], (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while deleting the user' });
    } else {
      console.log(`User with ID ${userId} deleted successfully`);
      res.json({ message: 'User deleted successfully' });
    }
  });
});

router.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const sqlQuery = `SELECT ID, USERNAME, EMAILID, PHONE FROM users WHERE ID = ${userId}`;

  connection.query(sqlQuery, [userId], (error, results) => {
    if (error) {
      res.status(500).json({ message: 'Error retrieving user details' });
    } else {
      const user = results[0];
      res.json(user);
    }
  });
});

router.put('/user/update-user/:id', (req, res) => {
  const userId = req.params.id;
  const { USERNAME, EMAILID, PHONE } = req.body;

  const query = `UPDATE users SET USERNAME = ?, EMAILID = ?, PHONE = ? WHERE ID = ${userId}`;
  const values = [USERNAME, EMAILID, PHONE];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'An error occurred while updating the user' });
    } else {
      console.log(`User with ID ${userId} updated successfully`);
      res.json({ message: 'User updated successfully' });
    }
  });
});

module.exports = router;
