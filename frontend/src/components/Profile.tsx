import React, { useContext } from 'react'
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';

function Profile() {
    const navigate = useNavigate();
    const {userData} = useContext(UserContext)

    if (!userData) {
        return <p>Loading...</p>;
    }

  return (
    <div>
      

      <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>This is profile screen</h1>
        <h1>My Profile</h1>
        <p>Name: {userData.firstname}</p>
        <p>Email: {userData.emailid}</p>
        <p>Your Referral Code: {userData.referralcode}</p>
        <button onClick={() => navigate('/referrals')}>

        Referral Program
      </button>
      </div>


      
    </div>
  )
}

export default Profile
