import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';

const BuyProduct = () => {
    const [billAmount, setBillAmount] = useState('');
    const [message, setMessage] = useState('');
    const [parentHierarchy, setParentHierarchy] = useState([]);
    const { userData } = useContext(UserContext); // To access current user data
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(true);

    const handleInputChange = (e) => {
        setBillAmount(e.target.value);
    };

    const fetchParentDetails = async () => {
        if (!userData) {
            setMessage('User data is not available. Please log in.');
            setIsLoading(false);
            return;
        }
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4999/get-parent-information-exclude-company', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setParentHierarchy(data.parentHierarchy || []);
                setMessage('');
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

    const handlePurchase = async () => {
        const bill = parseFloat(billAmount);
    
        if (isNaN(bill) || bill <= 0) {
            setMessage('Please enter a valid amount');
            return;
        }
    
        const totalCoins = Math.floor(bill / 100); // Calculate total coins
        const currentUserAmount = Math.round(totalCoins * 0.3); // 30% to current user
        const listOfParentAmount = Math.round(totalCoins * 0.2); // 20% to parents
        let companyCalculatedAmount = Math.round(totalCoins * 0.5); // 50% to company
    
        // Weighted distribution for parents
        const totalParents = parentHierarchy.length;
        const weights = Array.from({ length: totalParents }, (_, i) => totalParents - i);
        const totalWeight = weights.reduce((acc, weight) => acc + weight, 0);
    
        const parentDistribution = parentHierarchy.map((parent, index) => {
            const coins = Math.floor((weights[index] / totalWeight) * listOfParentAmount);
            return { name: parent.name, coins }; // Return object for easier processing
        });
    
        // Calculate total distributed coins for parents
        const totalDistributedToParents = parentDistribution.reduce((acc, parent) => acc + parent.coins, 0);
    
        // Adjust the company's coins to account for any discrepancy
        const missingCoins = listOfParentAmount - totalDistributedToParents;
        if (missingCoins > 0) {
            companyCalculatedAmount += missingCoins;
        }
    
        // Prepare data for wallet update
        const updateData = {
            parentDistribution,
            currentUser: { name: userData.username, coins: currentUserAmount },
            company: { name: 'Company', coins: companyCalculatedAmount },
        };
    
        // Set the message
        let combinedMessage = `Current user will get: ${currentUserAmount} coins,
                 List of parents will get: ${listOfParentAmount} coins,
                 Company will get: ${companyCalculatedAmount} coins,
                 Parent Distribution:
                 ${parentDistribution.map((parent) => `${parent.name}: ${parent.coins}`).join(', ')}`;
    
        // Update wallets
        try {
            const response = await fetch('http://localhost:4999/update-wallets', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });
    
            if (response.ok) {
                combinedMessage += '\nPurchase successful and wallets updated!';
            } else {
                const data = await response.json();
                combinedMessage += `\nFailed to update wallets: ${data.message}`;
            }
        } catch (error) {
            console.error('Error updating wallets:', error);
            combinedMessage += '\nAn error occurred while updating wallets.';
        }
    
        // Set the combined message
        setMessage(combinedMessage);
    };
    


    // Always call useEffect, and let fetchParentDetails handle the condition
    useEffect(() => {
        fetchParentDetails();
        // eslint-disable-next-line
    }, [userData]);

    // Redirect to login if no user is logged in
    if (!userData) {
        return (
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
                <h1>You are not logged in</h1>
                <button
                    onClick={() => navigate('/login')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007BFF',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '20px',
                    }}
                >
                    Go to Login
                </button>
            </div>
        );
    }

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Buy Product</h1>
            <h3>Logged in as: {userData.username}</h3>
            <div style={{ marginBottom: '20px' }}>
                <label htmlFor="billAmount" style={{ marginRight: '10px' }}>
                    Enter Bill Amount:
                </label>
                <input
                    id="billAmount"
                    type="number"
                    value={billAmount}
                    onChange={handleInputChange}
                    style={{ padding: '5px', width: '200px' }}
                />
            </div>
            <button
                onClick={handlePurchase}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Purchase
            </button>

            {message && (
                <div
                    style={{
                        marginTop: '20px',
                        padding: '10px',
                        border: '1px solid #007BFF',
                        borderRadius: '5px',
                        backgroundColor: '#E8F4FF',
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default BuyProduct;
