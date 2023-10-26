//Bahadır Keleşoğlu 14/10/2023

const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const router = express.Router();

const SECRET_KEY = "your_secret_key_here"; 

// database bağlantısı
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'anketyonetimdb'
  });

// /login sayfasında email ve password doğrulaması
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const query = 'SELECT * FROM users WHERE email = ?';
  connection.execute(query, [email], (error, users) => {
    if (error) {
      return res.status(500).send('Error logging in.');
    }

    const user = users[0];
    if (!user) {
      return res.status(401).send('Incorrect email or password.');
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send('Error comparing passwords.');
      }

      if (!isMatch) {
        return res.status(401).send('Incorrect email or password.');
      }
      //  user bilgilerinin kaydedilip,jwt ile giriş yapılması
      const tokenPayload = { userId: user.id, userEmail: user.email, name: user.name };
      const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '1h' });

      res.json({
        message: 'Logged in successfully!',
        token: token
      });
    });
  });
});

module.exports = router;
