//Bahadır Keleşoğlu 14/10/2023

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import './AnswerSurvey.css';

// sayfa id' sini almak ve diğer şeyler için bileşenler
const AnswerSurvey = ({}) => {
    const { id: surveyId } = useParams();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const navigate = useNavigate();
    //tokenı çözerek kullanıcının id'sine ulaşılır
    const token = localStorage.getItem('token');
    let userId;
    if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userId;
    }

    useEffect(() => {
        
        const fetchQuestionsAndAnswers = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/surveys/${surveyId}/questions`);
                setQuestions(response.data); //çektiğimiz soruları değişken içerisine tanımladık
    
                const answersResponse = await axios.get(`http://localhost:3001/surveys/${surveyId}/answers/${userId}`);
                // Assuming the server sends back a format like { questionId1: 'answer1', questionId2: 'answer2', ... }
                setAnswers(answersResponse.data); //çektiğimiz cevapları değişken içerisine tanımladık
    
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchQuestionsAndAnswers();
    }, [surveyId, userId]);
    
    //sayfada girilen cevapları günceller
    const handleInputChange = (e, questionId) => {
        setAnswers(prevState => ({ ...prevState, [questionId]: e.target.value }));
    };
    // cevapların son hali database'e gönderilir
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        for (let questionId in answers) { 
            try {
                await axios.post('http://localhost:3001/surveys/responses/submit', {
                    question_id: questionId,
                    user_id: userId,
                    answer_text: answers[questionId]
                    
                });
                
            } catch (error) {
                console.error("Error submitting response for question:", questionId, error);
            }
        }
        navigate("/explore"); // explore sayfasına yönlendirilir submitten sonra
    };
    //Arayüz
    return (
        <div>
            <h2>Answer the Survey</h2>
            <div className="question-container">
            {questions.map(question => (
                <div key={question.id} className="question">
                    <p className="enhanced-font">{question.question_text}</p>
                    <input
                        value={answers[question.id] || ''}
                        onChange={(e) => handleInputChange(e, question.id)}
                        placeholder="Your answer here..."
                    />
                </div>
            ))}
            </div>
            <button onClick={handleSubmit}>Submit Answers</button>
        </div>
    );
};

export default AnswerSurvey;

