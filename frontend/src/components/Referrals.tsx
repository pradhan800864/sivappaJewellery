import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import { UserContext } from '../UserContext';


const Referrals = () => {
    const [parentCode, setParentCode] = useState(null)
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const [assignedParent, setAssignedParent] = useState<{ name: string; referralCode: string } | null>(null);
    const [children, setChildren] = useState<{ name: string; referralCode: string }[]>([]);
    const [parentHierarchy, setParentHierarchy] = useState([]);
    // eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(true);
    const {userData} = useContext(UserContext)

    const fetchUserDetails = async () => {
        if (!userData) {
            setMessage('User data is not available. Please log in. new method');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4999/get-user-details', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();

            if (response.ok) {
                setAssignedParent(data.parent || null); // Assign parent object
                setChildren(data.children || []); // Assign children array
                setMessage('')
                
            } else {
                setMessage(data.message || 'Failed to fetch user details.');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setMessage('An error occurred while fetching user details.');
        } finally {
            setIsLoading(false);
        }
    };


    const fetchParentDetails = async () => {
        if (!userData) {
            setMessage('User data is not available. Please log in. new method');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4999/get-parent-information', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setParentHierarchy(data.parentHierarchy || [])
                setMessage('')
            } else {
                setMessage(data.message || 'Failed to fetch user details.');
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
            setMessage('An error occurred while fetching user details.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (userData) {
            fetchUserDetails();
            fetchParentDetails();
        } else {
            setIsLoading(false); // Stop loading if no userData
        }
        // eslint-disable-next-line
    }, [userData]);

       // Log updated parentHierarchy
    useEffect(() => {
    }, [parentHierarchy]);

    const handleLogout = () => {
        // Clear token storage
        localStorage.removeItem('token');
        navigate('/login');
    };
    
    const handleAddParent = async (e) => {
        e.preventDefault();
        if (!userData || !userData.referralcode) {
            setMessage('User data is not available. Please log in.');
            return;
        }
        try {
            const response = await fetch('http://localhost:4999/add-parent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ childCode: userData.referralcode, parentCode }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage('Parent assigned successfully!');
                // Re-fetch user details to refresh the UI
                fetchUserDetails();
            } else {
                setMessage(data.message || 'Failed to assign parent.');
            }
        } catch (error) {
            console.error('Error adding parent:', error);
            setMessage('An error occurred.');
        }
    };

    const handleAssignToCompany = async () => {
        if (!userData || !userData.referralcode) {
            setMessage('User data is not available. Please log in.');
            return;
        }
    
        try {
            // Fetch the referral code for the Company user
            const response = await fetch('http://localhost:4999/get-company-code', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
    
            const data = await response.json();
    
            if (response.ok) {
                const companyReferralCode = data.referralCode;
    
                // Assign the current user to the Company node
                const assignResponse = await fetch('http://localhost:4999/add-parent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ childCode: userData.referralcode, parentCode: companyReferralCode }),
                });
    
                const assignData = await assignResponse.json();
    
                if (assignResponse.ok) {
                    setMessage('You have been successfully assigned to the Company!');
                    fetchUserDetails(); // Refresh user details
                } else {
                    setMessage(assignData.message || 'Failed to assign to Company.');
                }
            } else {
                setMessage(data.message || 'Failed to fetch Company referral code.');
            }
        } catch (error) {
            console.error('Error assigning to Company:', error);
            setMessage('An error occurred while assigning to Company.');
        }
    };
    


    return (
        <div className="referrals-container">
            <h1>Referrals</h1>
            {userData ? (
                <>
                    {assignedParent ? (
                        <div >
                            <h3>You are assigned to parent: {assignedParent.name}</h3>
                            <h3>Your Children:</h3>
                            {children.length > 0 ? (
                                <ul className="children-list">
                                    {children.map((child, index) => (
                                        <li key={index} className="child-item">
                                            <strong>Name:</strong> {child.name} <br />
                                        </li>
                                        // <li key={index}>{child.name}</li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="no-children">
                                    <p>You currently have no children added.</p>
                                </div>
                            )}

                            <h3>Your Parents:</h3>

                            {Array.isArray(parentHierarchy) && parentHierarchy.length > 0 ? (
                                <ul className="children-list">
                                    {parentHierarchy.map((parent, index) => (
                                        <li key={parent.referralCode} className="child-item">
                                            <strong>Name:</strong> {parent.name} <br />
                                            <strong>Referral Code:</strong> {parent.referralCode} <br />
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="no-children">
                                    <p>You currently have no parents added.</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="no-parent">
                            <h2>Join Membership Program</h2>
                            <form onSubmit={handleAddParent} className="membership-form">
                                <div className="form-group">
                                    <label>Parent Referral Code: </label>
                                    <input
                                        type="text"
                                        value={parentCode || ''}
                                        onChange={(e) => setParentCode(e.target.value)}
                                        required
                                        style={{ margin: '10px 0', padding: '5px', width: '200px' }}
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="submit-button"
                                >
                                    Assign Parent
                                </button>
                                <button
                                onClick={handleAssignToCompany}
                                className="company-button"
                                style={{
                                    marginTop: '10px',
                                    padding: '10px 20px',
                                    backgroundColor: '#28a745',
                                    color: '#FFF',
                                    border: 'none',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
                                Don't have parent referral code?
                            </button>
                            </form>
                        </div>
                    )}
                    {message && <div className="message">{message}</div>}
                    <button
                        onClick={handleLogout}
                        className="logout-button">
                        Logout
                    </button>
                </>
            ) : (
                <div className="no-user">
                    <p>No User Logged in. Please log in to see your referral code and join the membership program.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="login-button">
                        Login
                    </button>
                </div>
                
            )}
        </div>
    );
};

export default Referrals
