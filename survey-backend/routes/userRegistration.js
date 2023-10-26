//Bahadır Keleşoğlu 14/10/2023

const express = require('express');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2');

const router = express.Router();
//database bağlantısı
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'anketyonetimdb'
});
// değişkenlerin /registerda alınması
router.post('/register', (req, res) => {
  const { name, email, password } = req.body;


  // şifreleme
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
        console.error("Bcrypt hashing error:", err);
        return res.status(500).send('Error hashing password.');
    }

    //database e yazılması
    const query = 'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())';
    connection.execute(query, [name, email, hashedPassword], (error, results) => {
      if (error) {
        return res.status(500).send('Error registering user.');
      }
      res.send('User registered successfully!');
    });
  });
});

module.exports = router;
