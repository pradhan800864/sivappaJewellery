import { useNavigate } from "react-router-dom";
import React, { useState } from 'react'
import '../style.css';

function Registration() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: '',
        firstname: '',
        lastname: '',
        emailid: '',
        password: ''
    })

    const handleChange = (e) => {
        const { name, value} = e.target;
        console.log(e.target);
        setFormData({...formData, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(formData)

        const response = await fetch('http://localhost:4999/register', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
        })

        console.log(response)

        if(response.ok) {
            alert('User Registration Successfull')
            navigate('/login')
        } else {
            alert('Registration Failed')
        }
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
      <h2>Register User</h2>

        <div>
            <label>Username:</label>
            <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            />
        </div>

        <div>
            <label>FirstName:</label>
            <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            />
        </div>

        <div>
            <label>LastName:</label>
            <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
            />
        </div>

        <div>
            <label>Email ID:</label>
            <input
            type="text"
            name="emailid"
            value={formData.emailid}
            onChange={handleChange}
            />
        </div>

        <div>
            <label>Password:</label>
            <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  )
}

export default Registration;
