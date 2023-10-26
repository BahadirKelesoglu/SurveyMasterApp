//Bahadır Keleşoğlu 14/10/2023

import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { MD5 } from 'crypto-js';


//bileşenler tanımlandı
const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        

        try {
            //md5 ile parolayı hashle
            const hashedPassword = MD5(password).toString();
            //route a istek gönderme
            const response = await axios.post('http://localhost:3001/users/login', {
                email,
                password: hashedPassword
            });
            
            // JWT tokenını yerel depoya kaydet
            localStorage.setItem('token', response.data.token);
            //ve dashboarda yönlendir
            navigate('/dashboard');

        } catch (err) {
            console.error("Error during login:", err);
            
            // Eğer backend'den spesifik bir hata mesajı gelirse onu göster
            if (err.response && err.response.data && err.response.data.error) {
                window.alert(err.response.data.error);
              } else {
                // Genel hata mesajını göster
                window.alert("Error during login. Please try again.");
              }
        }
    };

    //arayüz
    return (
        <div className="container">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
            <p>Not signed up? <a href="/signup">Click here...</a></p>
        </div>
    );
};

export default Login;

