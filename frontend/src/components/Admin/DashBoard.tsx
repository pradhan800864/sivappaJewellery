import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import '../../Dashboard.css'; // Import a CSS file for styling
import { Outlet } from 'react-router-dom';
import ManageUsersIcon from '../../images/user.png';
import ReferralSettings from '../../images/network.png';
import Discounts from '../../images/discount.png';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
    };
    
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <div className="dashboard-container">
            {/* Top Banner */}
            <div className="top-banner">
                <h1 className="brand-name">Sivappa Jewellers</h1>
                <h1 className="brand-name">Admin Dashboard</h1>
                <button onClick={handleLogout} className="logout-button">
                    Logout
                </button>
            </div>

            {/* Sidebar Navigation */}
            <div className={`sidebar ${isDropdownOpen ? 'dropdown-open' : ''}`}>
                {/* Manage Users Dropdown */}
                <div className="sidebar-dropdown">
                    <button
                        onClick={toggleDropdown}
                        className="sidebar-button dropdown-toggle"
                    >
                        <img
                            src={ManageUsersIcon}
                            alt="Manage Users Icon"
                            className="icon"
                        />
                        Users
                    </button>
                    {isDropdownOpen && (
                        <div className="dropdown-menu">
                            <button
                                onClick={() => navigate('manage-users/customers')}
                                className="dropdown-item"
                            >
                                Customers
                            </button>
                            <button
                                onClick={() => navigate('manage-users/store-admins')}
                                className="dropdown-item"
                            >
                                Store Admins
                            </button>
                        </div>
                    )}
                </div>

                {/* Other Sidebar Buttons */}
                <button
                    onClick={() => navigate('manage-referral-settings')}
                    className="sidebar-button"
                >
                    <img
                        src={ReferralSettings}
                        alt="Manage Users Icon"
                        className="icon"
                    />
                    Referral Settings
                </button>
                <button
                    onClick={() => navigate('discounts')}
                    className="sidebar-button"
                >
                    <img
                        src={Discounts}
                        alt="Manage Users Icon"
                        className="icon"
                    />
                    Discounts
                </button>
            </div>

            {/* Main Content Area */}
            <div className="main-content">
                <Outlet />
            </div>
        </div>
    );
};

export default AdminDashboard;
