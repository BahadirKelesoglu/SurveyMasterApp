//Bahadır Keleşoğlu 14/10/2023

const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

// Database bağlantı
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'anketyonetimdb'
});

// yeni bir anketi database'e yazma
router.post('/create', async (req, res) => {
    const { user_id, title, description, questions } = req.body;
    // queryi yazıp, değişkenleri alıp atamasını yapıyoruz
    const surveyQuery = 'INSERT INTO surveys (user_id, title, description) VALUES (?, ?, ?)';
    
    connection.execute(surveyQuery, [user_id, title, description], async (error, results) => {
        if (error) {
            console.error('Error inserting into surveys:', error);
            return res.status(500).send('Error creating survey.');
        }
        
        //atanmış anketin idsini alıyoruz
        const surveyId = results.insertId;
        
        // Yazılmış soruları döngü içinde tek tek database question tableına atıyoruz
        try {
            for (let question of questions) {
                const questionQuery = 'INSERT INTO questions (survey_id, question_text) VALUES (?, ?)';
                await connection.promise().execute(questionQuery, [surveyId, question]);
            }
            res.send('Survey and questions created successfully!');
        } catch (questionError) {
            console.error('Error inserting questions:', questionError);
            return res.status(500).send('Error adding questions to survey.');
        }
    });
});

//belirli bir userın tüm anketlerini görmek
router.get('/user/:userId', (req, res) => {
    const userId = req.params.userId;
   
    const query = 'SELECT * FROM surveys WHERE user_id = ?';
    
    connection.execute(query, [userId], (error, surveys) => {
        if (error) {
            console.error('Error fetching surveys:', error);
            return res.status(500).send('Error fetching surveys.');
        }
        res.json(surveys);
    });
});

// tüm anketleri çekme
router.get('/', (req, res) => {
    const query = 'SELECT * FROM surveys';
    connection.execute(query, (error, surveys) => {
        if (error) {
            return res.status(500).send('Error fetching surveys.');
        }
        res.json(surveys);
    });
});



//Belirli bir anketin tüm sorularını görmek
router.get('/:surveyId/questions', (req, res) => {
    const surveyId = req.params.surveyId;

    const query = 'SELECT * FROM questions WHERE survey_id = ?';
    
    connection.execute(query, [surveyId], (error, questions) => {
        if (error) {
            console.error('Error fetching questions:', error);
            return res.status(500).send('Error fetching questions.');
        }
        res.json(questions);
    });
});


// Belirli bir soruya belirli bir userın cevap vermesi
router.post('/responses/submit', (req, res) => {
    const { question_id, user_id, answer_text } = req.body;

    // user bu soruya daha önceden cevap vermişmi database kontrolü
    const checkQuery = 'SELECT * FROM responses WHERE question_id = ? AND user_id = ?';
    connection.execute(checkQuery, [question_id, user_id], (checkError, existingResponses) => {
        if (checkError) {
            console.error('Error checking existing responses:', checkError);
            return res.status(500).send('Error checking existing responses.');
        }

        if (existingResponses.length > 0) {
            // kullanıcı zaten yorum yaptıysa bu yorumu id'si sabit bir şekilde güncelliyoruz.
            const updateQuery = 'UPDATE responses SET answer_text = ? WHERE question_id = ? AND user_id = ?';
            connection.execute(updateQuery, [answer_text, question_id, user_id], (updateError, results) => {
                if (updateError) {
                    console.error('Error updating response:', updateError);
                    return res.status(500).send('Error updating response.');
                }
                res.send('Response updated successfully!');
            });
        } else {
            // eğer databasede yoksa yeni yazılan inputun database'e işlenmesi
            const insertQuery = 'INSERT INTO responses (question_id, user_id, answer_text) VALUES (?, ?, ?)';
            connection.execute(insertQuery, [question_id, user_id, answer_text], (insertError, results) => {
                if (insertError) {
                    console.error('Error submitting response:', insertError);
                    return res.status(500).send('Error submitting response.');
                }
                res.send('Response submitted successfully!');
            });
        }
    });
});

// belirli bir userın belirli bir anketin içerisindeki sorulara verdikleri cevapları çekiyoruz
router.get('/:surveyId/answers/:userId', (req, res) => {
    const surveyId = req.params.surveyId;
    const userId = req.params.userId;

    // bu amaç için yazılan query
    const query = `
        SELECT q.id AS question_id, r.answer_text 
        FROM questions q
        LEFT JOIN responses r ON q.id = r.question_id AND r.user_id = ?
        WHERE q.survey_id = ?
    `;
    //query execute
    connection.execute(query, [userId, surveyId], (error, results) => {
        if (error) {
            console.error('Error fetching answers:', error);
            return res.status(500).send('Error fetching answers.');
        }

        // çektiğimiz cevap arrayini, object formatına dönüştürüyoruz
        const answers = {};
        results.forEach(row => {
            answers[row.question_id] = row.answer_text || '';  
        });

        res.json(answers);
    });
});



// belirli soruya verilen cevaplar

router.get('/questions/:questionId/responses', (req, res) => {
    const questionId = req.params.questionId;

    const query = 'SELECT * FROM responses WHERE question_id = ?';
    
    connection.execute(query, [questionId], (error, responses) => {
        if (error) {
            console.error('Error fetching responses:', error);
            return res.status(500).send('Error fetching responses.');
        }
        res.json(responses);
    });
});

// anket title ve desc ı düzeltme
router.put('/update/:surveyId', (req, res) => {
    const surveyId = req.params.surveyId;
    const { title, description } = req.body; 

    const query = 'UPDATE surveys SET title = ?, description = ? WHERE id = ?';

    connection.execute(query, [title, description, surveyId], (error, results) => {
        if (error) {
            console.error('Error updating survey:', error);
            return res.status(500).send('Error updating survey.');
        }
        res.send('Survey updated successfully!');
    });
});

// anketin tüm elemanlarını çekme
router.get('/details/:surveyId', (req, res) => {
    const surveyId = req.params.surveyId;

    const query = 'SELECT * FROM surveys WHERE id = ?';

    connection.execute(query, [surveyId], (error, survey) => {
        if (error) {
            console.error('Error fetching survey details:', error);
            return res.status(500).send('Error fetching survey details.');
        }
        res.json(survey[0]); // Assuming one record is returned
    });
});





//anket silme
router.delete('/delete/:surveyId', (req, res) => {
    const surveyId = req.params.surveyId;

    const query = 'DELETE FROM surveys WHERE id = ?';

    connection.execute(query, [surveyId], (error, results) => {
        if (error) {
            console.error('Error deleting survey:', error);
            return res.status(500).send('Error deleting survey.');
        }
        res.send('Survey deleted successfully!');
    });
});

// soru düzeltme
router.put('/questions/:questionId', (req, res) => {
    const questionId = req.params.questionId;
    const { question_text } = req.body;

    const query = 'UPDATE questions SET question_text = ? WHERE id = ?';

    connection.execute(query, [question_text, questionId], (error, results) => {
        if (error) {
            console.error('Error updating question:', error);
            return res.status(500).send('Error updating question.');
        }
        res.send('Question updated successfully!');
    });
});


// soru silme
router.delete('/questions/delete/:questionId', (req, res) => {
    const questionId = req.params.questionId;

    const query = 'DELETE FROM questions WHERE id = ?';

    connection.execute(query, [questionId], (error, results) => {
        if (error) {
            console.error('Error deleting question:', error);
            return res.status(500).send('Error deleting question.');
        }
        res.send('Question deleted successfully!');
    });
});



module.exports = router;
