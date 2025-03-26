import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

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
                navigate('/admin/discounts')
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

    const navigateToDiscountsPage = () => {
        navigate('/admin/discounts')
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center', marginTop: '50px' }}>Discount Page</h1>

            {/* Card 1: Amount Off Product */}
            <div className="card">
                <h2>1. Amount Off Product</h2>
                <div>
                    <input
                        type="text"
                        value={discountCode}
                        placeholder="Enter discount code"
                        readOnly
                    />
                    <button onClick={generateDiscountCode}>Generate Code</button>
                </div>
            </div>

            {/* Card 2: Discount Value */}
            <div className="card">
                <h2>2. Discount Value</h2>
                <div>
                    <label>Percentage:</label>
                    <input
                        type="number"
                        value={discountValue}
                        onChange={(e) => setDiscountValue(e.target.value)}
                        placeholder="Enter percentage"
                    />
                </div>
                <div>
                    <label>Applicable Products:</label>
                    <input
                        type="text"
                        value={applicableProducts}
                        onChange={(e) => setApplicableProducts(e.target.value.split(','))}
                        placeholder="Add products separated by commas"
                    />
                </div>
            </div>

            {/* Card 3: Minimum Purchase Requirement */}
            <div className="card">
                <h2>3. Minimum Purchase Requirement</h2>
                <div>
                    <input
                        type="radio"
                        id="no-minimum"
                        name="minimumRequirement"
                        value="no-minimum"
                        checked={minimumRequirement === 'no-minimum'}
                        onChange={(e) => setMinimumRequirement(e.target.value)}
                    />
                    <label htmlFor="no-minimum">No Minimum Requirement</label>
                </div>
                <div>
                    <input
                        type="radio"
                        id="minimum-purchase-amount"
                        name="minimumRequirement"
                        value="minimum-amount"
                        checked={minimumRequirement === 'minimum-amount'}
                        onChange={(e) => setMinimumRequirement(e.target.value)}
                    />
                    <label htmlFor="minimum-purchase-amount">Minimum Purchase Amount($)</label>
                    {minimumRequirement === 'minimum-amount' && (
                        <input
                            type="number"
                            value={minimumValue}
                            onChange={(e) => setMinimumValue(e.target.value)}
                            placeholder="Enter amount"
                        />
                    )}
                </div>
                <div>
                    <input
                        type="radio"
                        id="minimum-quantity"
                        name="minimumRequirement"
                        value="minimum-quantity"
                        checked={minimumRequirement === 'minimum-quantity'}
                        onChange={(e) => setMinimumRequirement(e.target.value)}
                    />
                    <label htmlFor="minimum-quantity">Minimum Quantity Of Items</label>
                    {minimumRequirement === 'minimum-quantity' && (
                        <input
                            type="number"
                            value={minimumValue}
                            onChange={(e) => setMinimumValue(e.target.value)}
                            placeholder="Enter quantity"
                        />
                    )}
                </div>
            </div>

            {/* Card 4: Eligibility */}
            <div className="card">
                <h2>4. Eligibility</h2>
                <div>
                    <input
                        type="radio"
                        id="all-customers"
                        name="eligibility"
                        value="all-customers"
                        checked={eligibility === 'all-customers'}
                        onChange={(e) => setEligibility(e.target.value)}
                    />
                    <label htmlFor="all-customers">All Customers</label>
                </div>

                {/* yet to implement feature*/}
                {/* <div>
                    <input
                        type="radio"
                        id="specific-customers"
                        name="eligibility"
                        value="specific-customers"
                        checked={eligibility === 'specific-customers'}
                        onChange={(e) => setEligibility(e.target.value)}
                    />
                    <label htmlFor="specific-customers">Specific Customers</label>
                    {eligibility === 'specific-customers' && (
                        <input
                            type="text"
                            placeholder="Search customers by username, first name, or last name"
                            onChange={(e) => setSpecificCustomers([...specificCustomers, e.target.value])}
                        />
                    )}
                </div> */}
            </div>

            {/* Card 5: Active Dates */}
            <div className="card">
                <h2>5. Active Dates</h2>
                <div>
                    <label>Start Date and Time:</label>
                    <input
                        type="date"
                        value={activeStartDate}
                        onChange={(e) => setActiveStartDate(e.target.value)}
                    />
                    <input
                        type="time"
                        value={activeStartTime}
                        onChange={(e) => setActiveStartTime(e.target.value)}
                    />
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="set-end-date"
                        checked={setEndDate}
                        onChange={(e) => setSetEndDate(e.target.checked)}
                    />
                    <label htmlFor="set-end-date">Set End Date</label>
                </div>
                {setEndDate && (
                    <>
                        <input
                            type="date"
                            value={activeEndDate}
                            onChange={(e) => setActiveEndDate(e.target.value)}
                        />
                        <input
                            type="time"
                            value={activeEndTime}
                            onChange={(e) => setActiveEndTime(e.target.value)}
                        />
                    </>
                )}
            </div>

            {/* Buttons */}
            <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button
                    onClick={clearAllFields}
                    style={{
                        marginRight: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#FF4D4D',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Clear all changes
                </button>
                <button
                    onClick={handleCreateDiscount}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007BFF',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Create Discount
                </button>
                <button
                    onClick={navigateToDiscountsPage}
                    style={{
                        marginRight: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#FF4D4D',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginLeft: '10px'
                    }}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default AddDiscount;
