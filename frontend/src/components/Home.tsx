import React, { useContext } from 'react';
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';

const HomePage = () => {
    const navigate = useNavigate();
    const {userData} = useContext(UserContext)
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Welcome to the Home Page!</h1>
            {userData ? (
                <>
                    <h2>Hello, {userData.username}!</h2>
                    <p>Your referral code is: <strong>{userData.referralcode}</strong></p>
                </>
            ) : (
                <p>Loading user data...</p>
            )}

            <button onClick={() => navigate('/myprofile')}>
                My Profile
            </button>
        </div>
    );
};

export default HomePage;
