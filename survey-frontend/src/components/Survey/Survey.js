//Bahadır Keleşoğlu 14/10/2023

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './Survey.css'

//bileşenler tanımlandı
const Survey = () => {
    const [questions, setQuestions] = useState([]);
    //url deki id değerini alır
    const { id: surveyId } = useParams();
    const [surveyDetails, setSurveyDetails] = useState(null);

    useEffect(() => {
        // Tüm anketleri getirir ve belirli bir anketi bulur
        const fetchAllSurveysAndFindSpecific = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/surveys`);
                const allSurveys = response.data;
                //urldeki id değerindeki survey id sini arar
                const specificSurvey = allSurveys.find(survey => survey.id === parseInt(surveyId, 10)); 
                
                setSurveyDetails(specificSurvey);
            } catch (error) {
                console.error("Error fetching surveys:", error);
            }
        };
        
        fetchAllSurveysAndFindSpecific();

        // bulduğumuz anketin sorularını getirir
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`http://localhost:3001/surveys/${surveyId}/questions`);
                setQuestions(response.data);

                // Her bir soru için o sorunun yanıtlarını getirir.
                for (let question of response.data) {
                    const responses = await axios.get(`http://localhost:3001/surveys/questions/${question.id}/responses`);
                    question.responses = responses.data;
                }
                setQuestions([...response.data]);
                console.log("Fetched Questions:", response.data);
                
            } catch (error) {
                console.error("Error fetching questions and responses:", error);
            }
        };

        fetchQuestions();
    }, [surveyId]);
    
    return (
        <div className="survey-container">
            <h2>{surveyDetails ? surveyDetails.title : 'Loading...'}</h2>
            <div className="question-container">
                
            {questions.map((question, index) => (
                <div key={index} className="question-box">
                    <h3>Question: {question.question_text}</h3> 
                    <h4>Responses:</h4>
                    <ul>
                        {question.responses && question.responses.map((response, rIndex) => (
                            <li key={rIndex}>{response.answer_text}</li>
                        ))}
                    </ul>
                </div>
            ))}
            </div>
        </div>
    );
    
};

export default Survey;
