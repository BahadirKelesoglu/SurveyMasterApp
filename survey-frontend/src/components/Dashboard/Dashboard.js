//Bahadır Keleşoğlu 14/10/2023

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import Header from '../Header';
//bileşenler tanımlandı
const Dashboard = () => {
    const [surveys, setSurveys] = useState([]);
    const navigate = useNavigate();
    // giriş yapan userın tokenını çözerek userId sini ve name ini aldık.
    const token = localStorage.getItem('token');
    let userId;
    let name;
    if (token) {
        const decodedToken = jwtDecode(token);
        userId = decodedToken.userId;
        name = decodedToken.name;
    }
    //anketi kullanıcının window pop up ını onaylaması halinde silinmesi
    const deleteSurvey = async (surveyId) => {
        const userConfirmed = window.confirm("Are you sure you want to delete this survey?");
    
        if (!userConfirmed) {
            return; 
        }
    
        try {
            await axios.delete(`http://localhost:3001/surveys/delete/${surveyId}`);
            // anket bilgileri güncelleniyor, arayüz için
            setSurveys(prevSurveys => prevSurveys.filter(survey => survey.id !== surveyId));
        } catch (error) {
            console.error("Error deleting survey:", error);
            alert('Failed to delete the survey. Please try again.');
        }
    };
    
    useEffect(() => {
        // Giriş yapmış kullanıcının anketlerini getir
        const fetchSurveys = async () => {
            try {
                if (userId) { 
                    const response = await axios.get(`http://localhost:3001/surveys/user/${userId}`);
                    setSurveys(response.data);
                }
            } catch (error) {
                console.error("Error fetching user surveys:", error);
            }
        };

        fetchSurveys();
    }, [userId]); //ekstra sağlama almak amacıyla user id değişirse tekrardan fetchlenmesi için

    //arayüz
    return (
        <div className="container-fluid">
            <Header />
            
            <div className="container mt-5">
                <h2 className="mb-12">My Surveys</h2>
                
        <div className="row">
            <div className="col-md-10 offset-md-1">
                <div className="list-group">
                    {surveys.map((survey, index) => (
                        <div key={index} className="list-group-item">
                            <div className="d-flex justify-content-between align-items-center">
                                <span 
                                    className="survey-title" 
                                    onClick={() => navigate(`/survey/${survey.id}`)} //basılan ankete git
                                    style={{cursor: 'pointer'}}
                                >
                                    {survey.title}
                                </span>
                                <div>
                                    <button 
                                        className="btn btn-danger mr-2"
                                        onClick={() => deleteSurvey(survey.id)} // basılan anketi sil
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        className="btn btn-primary"
                                        onClick={() => navigate(`/update/${survey.id}`)} //basılan anketi güncelleme sayfasına git
                                    >
                                        Edit
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
