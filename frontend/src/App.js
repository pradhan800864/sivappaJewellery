import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Registration from './components/Registration.tsx';
import Login from './components/Login.tsx';
import Home from './components/Home.tsx';
import Profile from './components/Profile.tsx';
import Referrals from './components/Referrals.tsx';
import Logout from './components/Logout.tsx';
import TreeView from './components/TreeView.tsx';
import AdminLogin from './components/Admin/AdminLogin.tsx';
import DashBoard from './components/Admin/DashBoard.tsx';
import ManageReferralSettings from './components/Admin/ManageReferralSettings.tsx'
import BuyProduct from './components/BuyProduct.jsx';
import Discount from './components/Admin/Discounts.tsx';
import AddDiscount from './components/Admin/AddDiscount.jsx';
import StoreAdmins from './components/Admin/StoreAdmins.jsx';
import Customers from './components/Admin/Customers.jsx';

const App = () => {
    return (
       <>
       <Router>
            <Routes>
                <Route path="/register" element={<Registration />}/>
                <Route path="/login" element={<Login />}/>
                <Route path="/home" element={<Home />}/>
                <Route path="/myprofile" element={<Profile />}/>
                <Route path="/referrals" element={<Referrals />}/>
                <Route path="/logout" element={<Logout />}/>
                <Route path="/get-tree" element={<TreeView />}/>
                <Route path="/admin/login" element={<AdminLogin />}/>
                <Route path="/admin/dashboard" element={<DashBoard />}>
                    <Route path="manage-users/customers" element={<Customers />} />
                    <Route path="manage-users/store-admins" element={<StoreAdmins />} />
                    <Route path="manage-referral-settings" element={<ManageReferralSettings />}/>
                    <Route path="discounts" element={<Discount />} />
                    <Route path="discounts/add-discount" element={<AddDiscount />} />
                </Route>
                <Route path="/buy-product" element={<BuyProduct />} />
            </Routes>
        </Router>
       </>
    )
}

export default App;
