//Bahadır Keleşoğlu 14/10/2023

import React, { useState } from 'react';
import axios from 'axios';
import './Signup.css';
import { MD5 } from 'crypto-js';

//bileşenler tanımlandı
const Signup = () => {
    const [successMessage, setSuccessMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignup = async (e) => {
        e.preventDefault(); // sayfa yenileme engeller
        // Handle the signup logic here once we're ready to connect with the backend

        try {
            //parola md5 ile hashlendi
            const hashedPassword = MD5(password).toString();
            const response = await axios.post('http://localhost:3001/users/register', {
                name,
                email,
                password: hashedPassword
            });
            
            setSuccessMessage('Signup successful! You can now login.');
            

        } catch (err) {
            console.error("Error during signup:", err);
            
        }
    };
    //arayüz
    return (
        <div className="container">
            <h2>Signup</h2>
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
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
                <button type="submit">Signup</button>
            </form>
            <p>Already have an account? <a href="/">Login here...</a></p>
            {successMessage && <p className="success-message">{successMessage}</p>}
        </div>
    );
};

export default Signup;
