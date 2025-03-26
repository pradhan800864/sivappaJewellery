import React, { useState, useEffect } from 'react';

const CustomersTable = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(15);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:4999/admin/get-users?username=${searchQuery}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (response.ok) {
                setUsers(data.users);
            } else {
                console.error('Failed to fetch users:', data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        // eslint-disable-next-line
    }, [searchQuery]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(users.length / itemsPerPage);

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const goToPreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1);
        }
    };

    return (
        <div style={{ padding: '20px', height: '100%', width: '100%' }}>
            <h1 style={{ textAlign: 'center' }}>Customers</h1>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search by username"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                    padding: '10px',
                    width: '300px',
                    borderRadius: '5px',
                    border: '1px solid #ddd',
                    marginBottom: '20px',
                    display: 'block',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}
            />

            {/* Table */}
            {loading ? (
                <p style={{ textAlign: 'center' }}>Loading...</p>
            ) : (
                <>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                            textAlign: 'center', // Center-align all text
                        }}
                    >
                        <thead style={{ backgroundColor: '#f4f4f4' }}>
                            <tr>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Username</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Email</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Referral Code</th>
                                <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Wallet</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentUsers.map((user, index) => (
                                <tr key={index} style={{ borderBottom: '1px solid #ddd' }}>
                                    <td style={{ padding: '12px' }}>{user.username}</td>
                                    <td style={{ padding: '12px' }}>{user.emailid}</td>
                                    <td style={{ padding: '12px' }}>{user.referralcode}</td>
                                    <td style={{ padding: '12px' }}>{user.wallet}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div
                        style={{
                            marginTop: '20px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <button
                            onClick={goToPreviousPage}
                            disabled={currentPage === 1}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: currentPage === 1 ? '#ddd' : '#007BFF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                                marginRight: '10px',
                            }}
                        >
                            Previous
                        </button>
                        <span>
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: currentPage === totalPages ? '#ddd' : '#007BFF',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '5px',
                                cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                                marginLeft: '10px',
                            }}
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default CustomersTable;
