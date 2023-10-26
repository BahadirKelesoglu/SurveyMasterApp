//Bahadır Keleşoğlu 14/10/2023

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import './Explore.css';
import Header from '../Header';

//bileşenler tanımlandı
const Explore = () => {
    const [surveys, setSurveys] = useState([]);
    const navigate = useNavigate();

    // giriş yapan userın tokenını çözerek name ini aldık.
    const token = localStorage.getItem('token');
    let name;
    if (token) {
        const decodedToken = jwtDecode(token);
        
        name = decodedToken.name;
    }

    useEffect(() => {
        // anketler çekiliyor
        const fetchSurveys = async () => {
            try {
                const response = await axios.get('http://localhost:3001/surveys');
                setSurveys(response.data);
            } catch (err) {
                console.error("Error fetching surveys:", err);
            }
        };

        fetchSurveys();
    }, []);// her yüklendiğinde

    return (
        <div className="container-fluid">
            <Header />
            
            <div className="container mt-5 offset-md-0">
                <h2 className="mb-4">Explore Surveys</h2>
                
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                        <div className="list-group">
                            {surveys.map((survey, index) => ( //for döngüsü ile get lenen veri basılıyor
                                <div key={index} className="list-group-item">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span 
                                            className="survey-title" 
                                            onClick={() => navigate(`/answer-survey/${survey.id}`)} // basılan anketi cevaplamaya git
                                            style={{cursor: 'pointer'}}
                                        >
                                            {survey.title}
                                        </span>
                                        <p>{survey.description}</p>
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

export default Explore;
