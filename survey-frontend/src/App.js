//Bahadır Keleşoğlu 14/10/2023

import React, { useEffect } from 'react'; // Add useEffect here
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import Dashboard from './components/Dashboard/Dashboard';
import CreateSurvey from './components/CreateSurvey/CreateSurvey';
import Explore from './components/Explore/Explore';
import Survey from './components/Survey/Survey';
import AnswerSurvey from './components/AnswerSurvey/AnswerSurvey';
import UpdateSurvey from './components/UpdateSurvey/UpdateSurvey';

//sayfaların routeları
function App() {
  return (
    <Router>
      <AuthWrapper>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/create-survey" element={<CreateSurvey />} />
          <Route path="/survey/:id" element={<Survey />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/answer-survey/:id" element={<AnswerSurvey />} />
          <Route path="/update/:surveyId" element={<UpdateSurvey />} />

          
        </Routes>
      </AuthWrapper>
    </Router>
  );
}

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // şu anki konum bilgisini tutar

   
  useEffect(() => {
    const token = localStorage.getItem('token');
    let isAuthenticated = false;
//giriş yapılmışmı kontrolü
    if (token) {
      try {
        jwtDecode(token);
        isAuthenticated = true;
      } catch (error) {
        console.error("Token invalid:", error);
      }
    }

    // giriş yapılmamışsa login ve sign up dan başka yere giremez
    if (!isAuthenticated && (location.pathname !== "/" && location.pathname !== "/signup")) {
      navigate("/");
      // giriş yapılmışsa login ve sign up girilemez
    } else if (isAuthenticated && (location.pathname === "/" || location.pathname === "/signup")) {
      navigate("/dashboard");
    }

  }, [location.pathname]); // url değişirse çalıştır

  return children;
};

export default App;
