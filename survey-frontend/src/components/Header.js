import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';
import jwtDecode from 'jwt-decode';
// bileşenler tanımlandı ve giriş yapılan userın tokeni alındı
const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    let userName = '';
    //token decode lanarak username alınndı
    if (token) {
        const decodedToken = jwtDecode(token);
        userName = decodedToken.name;
    }
    //yönlendirme fonksiyonu
    const handleNavigation = (path) => {
        navigate(path);
    };
    
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light navbar-custom">
            <div className="container-fluid">

                {/* Sol Taraf */}
                <div className="d-flex">
                    <button className="btn btn-primary mr-2" onClick={() => handleNavigation("/dashboard")}>Home</button>
                    <button className="btn btn-info mr-2" onClick={() => handleNavigation("/explore")}>Explore</button>
                    <button className="btn btn-info mr-2" onClick={() => handleNavigation("/create-survey")}>Create</button>
                </div>

                {/* Ortada oluşturulan boşluk */}
                <div className="flex-grow-1"></div>

                {/* Sağ taraf */}
                <div className="d-flex">
                    <span className="btn btn-link navbar-brand">{userName}</span>
                    <button className="btn btn-danger mr-2" onClick={() => {
                        localStorage.removeItem('token');
                        navigate("/");
                    }}>Logout</button>
                </div>

            </div>
        </nav>
    );
};

export default Header;




