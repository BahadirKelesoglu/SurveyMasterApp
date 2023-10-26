//Bahadır Keleşoğlu 14/10/2023

import React, { useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import './CreateSurvey';

//bileşenler tanımlandı
const CreateSurvey = () => {
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState(['']);

    // giriş yapan userın tokenını çözerek userId sini aldık.
    const token = localStorage.getItem('token');
    let userId;
    if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userId;
        
    }
    //questions değişkenine atama yapılıyor, questions içerisindeki elemanlar ayırılarak 
    const handleQuestionChange = (index, value) => {
        const newQuestions = [...questions];
        newQuestions[index] = value;
        setQuestions(newQuestions);
    };

    //arraya yeni soru ekleniyor
    const addQuestion = () => {
        if (questions.length < 15) {
            setQuestions([...questions, '']);
        } else {
            alert("Max 15 questions are allowed!");
        }
    };

    //soruyu kaldır
    const removeQuestion = (index) => {
        const newQuestions = [...questions];
        newQuestions.splice(index, 1);
        setQuestions(newQuestions);
    };

    // formu submitleme işlemleri
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // gönderilecek değişkenler ve gönderilen route
            const response = await axios.post('http://localhost:3001/surveys/create', {
                title,
                description,
                questions,
                user_id: userId 
                
            });

            navigate('/explore'); //explore yönledir

        } catch (error) {
            console.error("Error creating survey:", error);
        }
    };

    return (
        <div>
            <Header />
            <h2>Create a New Survey</h2>
            <form onSubmit={handleSubmit}>
                <input
                                type="text"
                                placeholder="Survey Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                />
                <input
                                placeholder="Survey Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                />
                <div className="question-container">
                    {questions.map((question, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                placeholder={`Question ${index + 1}`}
                                value={question}
                                onChange={(e) => handleQuestionChange(index, e.target.value)} // her değişimde fonksiyon çağırılıyor
                            />
                            <button type="button" class="btn-sm btn-danger mb-2" onClick={() => removeQuestion(index)}>-</button>
                        </div>
                    ))}
                    <button type="button" class="btn-sm btn-success mb-2" onClick={addQuestion}>+</button>
                </div>
                <button type="submit">Create Survey</button>
            </form>
        </div>
    );
};

export default CreateSurvey;
