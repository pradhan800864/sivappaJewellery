const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router();
const pool = require('../db');
const {authenticateAdmin} = require('../middleware/authMiddleware')
require('dotenv').config();

// Admin login endpoint
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log("username ", username)
    try {
        // Fetch admin user by username
        const result = await pool.query('SELECT * FROM admin WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Admin not found' });
        }

        const admin = result.rows[0];

        // Validate password
        const isValidPassword = await bcrypt.compare(password, admin.password);
        if (!isValidPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: admin.id, username: admin.username, role: 'admin' },
            process.env.JWT_SECRET,
            { expiresIn: '10h' }
        );

        return res.status(200).json({ token });
    } catch (error) {
        console.error('Error logging in admin:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/dashboard', authenticateAdmin, async (req, res) => {
    try {
        // Fetch admin details
        const adminResult = await pool.query('SELECT username FROM admin WHERE id = $1', [req.admin.id]);
        const admin = adminResult.rows[0];

        // Fetch user data (example: last 10 users)
        const usersResult = await pool.query('SELECT username, referralcode FROM users');
        const users = usersResult.rows;
        return res.status(200).json({
            admin,
            users,
        });
    } catch (error) {
        console.error('Error fetching admin dashboard data:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// Update levels endpoint
router.put('/update-levels', async (req, res) => {
    const { levels } = req.body; // Array of levels with updated values

    if (!Array.isArray(levels) || levels.length === 0) {
        return res.status(400).json({ message: 'Invalid data provided' });
    }

    try {
        // Use a transaction to update multiple rows
        await pool.query('BEGIN');
        for (const level of levels) {
            await pool.query(
                'UPDATE Levels SET value = $1 WHERE level = $2',
                [level.value, level.level]
            );
        }
        await pool.query('COMMIT');

        return res.status(200).json({ message: 'Levels updated successfully' });
    } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Error updating levels:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/create-discount', authenticateAdmin, async (req, res) => {
    const {
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
    } = req.body;

    const startDate = `${activeStartDate} ${activeStartTime}`;
    const endDate = setEndDate ? `${activeEndDate} ${activeEndTime}` : null;

    try {
        await pool.query(
            `INSERT INTO discounts 
            (discount_code, discount_value, applicable_products, minimum_requirement, minimum_value, eligibility, specific_customers, active_start_date, active_end_date) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [
                discountCode,
                discountValue,
                applicableProducts,
                minimumRequirement,
                minimumValue || null,
                eligibility,
                specificCustomers || null,
                startDate,
                endDate,
            ]
        );

        res.status(201).json({ message: 'Discount created successfully' });
    } catch (error) {
        console.error('Error creating discount:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/get-discounts',authenticateAdmin, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM discounts');
        res.status(200).json({ discounts: result.rows });
    } catch (error) {
        console.error('Error fetching discounts:', error);
        res.status(500).json({ message: 'Failed to fetch discounts' });
    }
});

router.get('/get-users', authenticateAdmin, async (req, res) => {
    const { username } = req.query; // Capture the search query from the request
    try {
        let query = 'SELECT username, emailid, referralcode, wallet FROM users';
        const params = [];

        if (username) {
            query += ' WHERE username ILIKE $1';
            params.push(`%${username}%`);
        }

        const result = await pool.query(query, params);
        res.status(200).json({ users: result.rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});


router.get('/get-levels', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Levels ORDER BY CAST(SUBSTRING(level FROM 6) AS INT)');
        return res.status(200).json({ levels: result.rows });
    } catch (error) {
        console.error('Error fetching levels:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;