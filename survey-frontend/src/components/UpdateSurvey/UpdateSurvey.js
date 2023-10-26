//Bahadır Keleşoğlu 14/10/2023

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import './UpdateSurvey.css';

//bileşenler tanımlandı ve surveyid, url parametrelerinden çekiliyor
const UpdateSurvey = () => {
    
    const { surveyId } = useParams();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);



    useEffect(() => {
        // Bu fonksiyon, belirli bir surveyID için anket bilgileri ve sorularını çeker.
        async function fetchData() {
            if(!surveyId) {
                console.error("Survey ID not provided");
                return;
            }
            try {
                //title ı ve descriptionı çekildi
                const surveyResponse = await axios.get(`http://localhost:3001/surveys/details/${surveyId}`);
                setTitle(surveyResponse.data.title);
                setDescription(surveyResponse.data.description);
                
                // sorular çekildi
                const questionsResponse = await axios.get(`http://localhost:3001/surveys/${surveyId}/questions`);
                setQuestions(questionsResponse.data);
            } catch (error) {
                console.error("Error fetching survey and questions:", error);
            }
        }
        fetchData();
    }, [surveyId]);

 
    // soru silme fonksiyonu
    const handleQuestionDelete = async (questionId) => {
        try {
            await axios.delete(`http://localhost:3001/surveys/questions/delete/${questionId}`);
            setQuestions(questions.filter(q => q.id !== questionId));  // soruyu databaseten sonra arraydende silmek
        } catch (error) {
            console.error("Error deleting question:", error);
        }
    };


    
    // belirli bir soru nun değişikliğini yerel değişkene kaydetmek için kullanılan fonksiyon
    const handleQuestionChange = (index, newValue) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].question_text = newValue;
        setQuestions(updatedQuestions);
    };

        // Bütün güncellemeleri kaydetmek için bu fonksiyonu kullanıyoruz.
        const handleUpdate = async () => {
            try {
                // anket detaylarını databasede güncelle title ve description
                await axios.put(`http://localhost:3001/surveys/update/${surveyId}`, {
                    title: title,
                    description: description
                });
        
                // Her bir soru loop içinde gezilerek databasede güncellenir
                for (const question of questions) {

                        await axios.put(`http://localhost:3001/surveys/questions/${question.id}`, {
                            question_text: question.question_text
                        });
                    
                }
        
                navigate("/");
            } catch (error) {
                console.error("Error updating:", error);
                alert('Failed to update.');
            }
        };
        

 

    
        // arayüz
        return (
            <div>
                <h2>Update Survey</h2>
                <div>
                    <input
                        type="text"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <input
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                    />
                </div>
                <button className="btn-success mb-3" onClick={handleUpdate}>Save All Changes</button>
                <div className="question-container">
                {questions.map((q, index) => (
                    <div key={q.id} className="question">
                        <input
                            type="text"
                            value={q.question_text}
                            onChange={e => handleQuestionChange(index, e.target.value)}
                        />
                        <button className="btn-danger" onClick={() => handleQuestionDelete(q.id)}>Delete</button>
                    </div>
                    
                ))}
                </div>
            </div>
        );
        
};

export default UpdateSurvey;