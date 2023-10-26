//Bahadır Keleşoğlu 14/10/2023

const express = require('express');
const mysql = require('mysql2');
const userRegistration = require('./routes/userRegistration');
const userAuthentication = require('./routes/userAuthentication');
const surveyRoutes = require('./routes/surveyRoutes');
const bodyParser = require('body-parser');
const cors = require('cors');



const app = express();
const PORT = 3001; // react ile farklı olması için

//database bağlantısı
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'anketyonetimdb'
  });

  connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err.stack);
      return;
    }
    console.log('Connected to the MySQL database.');
  });

app.get('/', (req, res) => {
    res.send('Hello from the backend!');
});



app.use(bodyParser.json()); // application/json dosyasını parselamak için
app.use(bodyParser.urlencoded({ extended: true })); //application/x-www-form-urlencoded parselamak için
app.use(cors()); //cors politikaları devre dışı kalır ve 3000 portundan 3001 e isteklere izin verir

//routes lar için başlangıç urlleri
app.use('/users', userRegistration);
app.use('/users', userAuthentication);
app.use('/surveys', surveyRoutes);

//açılan portu dinleyerek backendi ayağa kaldırma işlemi
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
