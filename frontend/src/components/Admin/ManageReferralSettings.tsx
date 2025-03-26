import React, { useState, useEffect } from 'react';

const ManageReferralSettings = () => {
    const [levels, setLevels] = useState<{ level: number; value: number }[]>([]);

    useEffect(() => {
        // Fetch the current levels from the backend
        const fetchLevels = async () => {
            const response = await fetch('http://localhost:4999/get-levels');
            const data = await response.json();
            console.log("data ", data)
            if (response.ok) {
                setLevels(data.levels);
            } else {
                console.error('Failed to fetch levels');
            }
        };

        fetchLevels();
    }, []);

    const handleInputChange = (index: number, value: number) => {
        const updatedLevels = [...levels];
        updatedLevels[index].value = value;
        setLevels(updatedLevels);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch('http://localhost:4999/update-levels', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ levels }),
        });

        console.log("response ", response)

        const data = await response.json();

        if (response.ok) {
            alert('Referral settings updated successfully!');
        } else {
            alert('Failed to update referral settings: ' + data.message);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <h1>Manage Referral Settings</h1>
            <form onSubmit={handleSubmit} style={{ display: 'inline-block', textAlign: 'left' }}>
                {levels.map((level, index) => (
                    <div key={level.level} style={{ marginBottom: '10px' }}>
                        <label>Level {level.level}:</label>
                        <input
                            type="number"
                            value={level.value}
                            onChange={(e) => handleInputChange(index, parseFloat(e.target.value))}
                            style={{ marginLeft: '10px', padding: '5px', width: '100px' }}
                            required
                        />
                    </div>
                ))}
                <button
                    type="submit"
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007BFF',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Update Settings
                </button>
            </form>
        </div>
    );
};

export default ManageReferralSettings;
