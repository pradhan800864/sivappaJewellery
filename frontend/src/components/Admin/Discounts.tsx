import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface Discount {
    discount_code: string;
    discount_value: number;
    minimum_requirement: string | null;
    eligibility: string;
    active_start_date: string;
    active_end_date: string | null;
}

const Discounts = () => {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const navigate = useNavigate();

    // Fetch all discounts from the backend
    const fetchDiscounts = async () => {
        try {
            const response = await fetch('http://localhost:4999/admin/get-discounts', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                setDiscounts(data.discounts as Discount[]);
            } else {
                console.error('Failed to fetch discounts:', data.message);
            }
        } catch (error) {
            console.error('Error fetching discounts:', error);
        }
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const checkStatus = (startDate, endDate) => {
        const now = new Date();
        const start = new Date(startDate);
        const end = endDate ? new Date(endDate) : null;

        if (now < start) {
            return <span style={{ color: 'black' }}>Not Activated</span>;
        }
        if (now >= start && (!end || now <= end)) {
            return <span style={{ color: 'green' }}>Active</span>;
        }
        return <span style={{ color: 'red' }}>Expired</span>;
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ textAlign: 'center' }}>Discounts</h1>
            <div style={{ textAlign: 'right', marginBottom: '10px' }}>
                <button
                    onClick={() => navigate('add-discount')}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007BFF',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                    }}
                >
                    Add Discount
                </button>
            </div>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    textAlign: 'left',
                }}
            >
                <thead>
                    <tr style={{ backgroundColor: '#f4f4f4' }}>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Code</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Discount Value</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Minimum Purchase</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Eligibility</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Active Dates</th>
                        <th style={{ padding: '10px', border: '1px solid #ddd' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {discounts.length > 0 ? (
                        discounts.map((discount, index) => (
                            <tr key={index}>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {discount.discount_code}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {discount.discount_value}%
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {discount.minimum_requirement || 'None'}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {discount.eligibility}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {discount.active_start_date}
                                    {discount.active_end_date ? ` - ${discount.active_end_date}` : ' (No End Date)'}
                                </td>
                                <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                                    {checkStatus(discount.active_start_date, discount.active_end_date)}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan='5'
                                style={{
                                    padding: '10px',
                                    border: '1px solid #ddd',
                                    textAlign: 'center',
                                    color: '#999',
                                }}
                            >
                                No discounts available
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Discounts;
