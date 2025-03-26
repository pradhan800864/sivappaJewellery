import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Clear token storage
        localStorage.removeItem('token');
        // sessionStorage.removeItem('token');

        // Redirect to login page
        navigate('/login');
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                padding: '10px 20px',
                backgroundColor: '#FF4D4D',
                color: '#FFF',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                marginTop: '20px',
            }}
        >
            Logout
        </button>
    );
};

export default Logout;
