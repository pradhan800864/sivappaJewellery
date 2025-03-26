import React, { useState, useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';
import '../style.css';

function Login() {


    const navigate = useNavigate();
    const { setUserData } = useContext(UserContext);
    const [loginFormData, setLoginFormData] = useState({
        username: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value} = e.target;
        setLoginFormData({...loginFormData, [name]: value});
    }

    const handleSubmit = async (e) => { 
        e.preventDefault();

        const response = await fetch('http://localhost:4999/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginFormData)
        })

        const data = await response.json()

        if(response.ok) {
            alert('User Login Successfull')
            localStorage.setItem('token', data.token)
            setUserData(data.user); // Update UserContext with user data
            window.dispatchEvent(new Event('token-changed')); // Dispatch custom event
            navigate('/home')
        } else {
            alert('Login Failed')
        }
    }

  return (
    <div>
        <form onSubmit={handleSubmit}>
            <h2>Login User</h2>
            <div>
                <label>Username:</label>
                <input
                type="text"
                name="username"
                value={loginFormData.username}
                onChange={handleChange}
                />
            </div>

            <div>
                <label>Password:</label>
                <input
                type="password"
                name="password"
                value={loginFormData.password}
                onChange={handleChange}
                />
            </div>

        <button type="submit">Login</button>
            
        </form>
    </div>
  )
}

export default Login
