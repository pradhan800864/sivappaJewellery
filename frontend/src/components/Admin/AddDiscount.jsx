import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './AddDiscount.css'; // Import CSS file for styles

const AddDiscount = () => {
    const [discountCode, setDiscountCode] = useState('');
    const [discountValue, setDiscountValue] = useState('');
    const [applicableProducts, setApplicableProducts] = useState([]);
    const [minimumRequirement, setMinimumRequirement] = useState('no-minimum');
    const [minimumValue, setMinimumValue] = useState('');
    const [eligibility, setEligibility] = useState('all-customers');
    const [specificCustomers, setSpecificCustomers] = useState([]);
    const [activeStartDate, setActiveStartDate] = useState('');
    const [activeStartTime, setActiveStartTime] = useState('');
    const [setEndDate, setSetEndDate] = useState(false);
    const [activeEndDate, setActiveEndDate] = useState('');
    const [activeEndTime, setActiveEndTime] = useState('');
    const navigate = useNavigate();

    // Generate random discount code
    const generateDiscountCode = () => {
        const code = Math.random().toString(36).substr(2, 6).toUpperCase() + Math.random().toString(36).substr(2, 6).toUpperCase();
        setDiscountCode(code);
    };

    const handleCreateDiscount = async () => {
        const discountData = {
            discountCode,
            discountValue,
            applicableProducts,
            minimumRequirement,
            minimumValue,
            eligibility,
            specificCustomers,
            activeStartDate,
            activeStartTime,
            setEndDate,
            activeEndDate,
            activeEndTime,
        };

        try {
            const response = await fetch('http://localhost:4999/admin/create-discount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                },
                body: JSON.stringify(discountData),
            });

            if (response.ok) {
                alert('Discount created successfully!');
                clearAllFields();
                navigate('/admin/dashboard/discounts')
            } else {
                alert('Failed to create discount.');
            }
        } catch (error) {
            console.error('Error creating discount:', error);
        }
    };

    const clearAllFields = () => {
        setDiscountCode('');
        setDiscountValue('');
        setApplicableProducts([]);
        setMinimumRequirement('no-minimum');
        setMinimumValue('');
        setEligibility('all-customers');
        setSpecificCustomers([]);
        setActiveStartDate('');
        setActiveStartTime('');
        setSetEndDate(false);
        setActiveEndDate('');
        setActiveEndTime('');
    };

    return (
        <div className="discount-container">
            <h1>Discount Page</h1>

            {/* Discount Code */}
            <div className="card">
                <h2>1. Discount Code</h2>
                <div className="input-group-discount">
                    <input type="text" value={discountCode} readOnly placeholder="Generated Code" />
                    <button onClick={generateDiscountCode}>Generate Code</button>
                </div>
            </div>

            {/* Discount Value */}
            <div className="card">
                <h2>2. Discount Value</h2>
                <div className="input-group-discount">
                    <label>Percentage:</label>
                    <input type="number" value={discountValue} onChange={(e) => setDiscountValue(e.target.value)} placeholder="Enter percentage" />
                </div>
                <div className="input-group-discount">
                    <label>Applicable Products:</label>
                    <input type="text" value={applicableProducts} onChange={(e) => setApplicableProducts(e.target.value.split(','))} placeholder="Product names, separated by commas" />
                </div>
            </div>

            {/* Minimum Requirement */}
            <div className="card">
                <h2>3. Minimum Purchase Requirement</h2>
                <div className="input-group-discount">
                    <label>
                        <input type="radio" value="no-minimum" checked={minimumRequirement === 'no-minimum'} onChange={() => setMinimumRequirement('no-minimum')} />
                        No Minimum Requirement
                    </label>
                    <label>
                        <input type="radio" value="minimum-amount" checked={minimumRequirement === 'minimum-amount'} onChange={() => setMinimumRequirement('minimum-amount')} />
                        Minimum Purchase Amount ($)
                    </label>
                    {minimumRequirement === 'minimum-amount' && (
                        <input type="number" value={minimumValue} onChange={(e) => setMinimumValue(e.target.value)} placeholder="Enter amount" />
                    )}
                </div>
            </div>

            {/* Active Dates */}
            <div className="card">
                <h2>4. Active Dates</h2>
                <div className="input-group-discount">
                    <label>Start Date:</label>
                    <input type="date" value={activeStartDate} onChange={(e) => setActiveStartDate(e.target.value)} />
                    <input type="time" value={activeStartTime} onChange={(e) => setActiveStartTime(e.target.value)} />
                </div>
                <div className="input-group-discount">
                    <input type="checkbox" checked={setEndDate} onChange={() => setSetEndDate(!setEndDate)} />
                    <label>Set End Date</label>
                </div>
                {setEndDate && (
                    <div className="input-group-discount">
                        <input type="date" value={activeEndDate} onChange={(e) => setActiveEndDate(e.target.value)} />
                        <input type="time" value={activeEndTime} onChange={(e) => setActiveEndTime(e.target.value)} />
                    </div>
                )}
            </div>

            {/* Buttons */}
            <div className="button-group-discount">
                <button className="clear-btn" onClick={clearAllFields}>Clear</button>
                <button className="submit-btn" onClick={handleCreateDiscount}>Create Discount</button>
            </div>
        </div>
    );
};

export default AddDiscount;
