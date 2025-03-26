import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

const UserProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);

    const fetchUserData = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUserData(null);
            return;
        }

        try {
            const response = await fetch('http://localhost:4999/current-user', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            } else {
                setUserData(null);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
            setUserData(null);
        }
    };

    useEffect(() => {
        // Fetch user data when the component mounts
        fetchUserData();

        // Add a listener for token changes
        const tokenListener = () => {
            fetchUserData();
        };

        window.addEventListener('token-changed', tokenListener);

        return () => {
            window.removeEventListener('token-changed', tokenListener);
        };
    }, []);

    return (
        <UserContext.Provider value={{ userData, setUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserProvider;
