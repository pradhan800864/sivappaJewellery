const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db');
const {authenticateUser} = require('../middleware/authMiddleware')
const router = express.Router();
const {generateReferralCode} = require('../utils/utils')
const { getParentHierarchy } = require('../utils/treeUtils');
require('dotenv').config();

// Registration Route
router.post('/register', async (req, res) => {
    const { username, firstname, lastname, emailid, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash password
        let referralCode;

        // Generate a unique referral code
        while (true) {
            referralCode = generateReferralCode(); // Call your utility function
            const result = await pool.query('SELECT COUNT(*) FROM users WHERE referralcode = $1', [referralCode]);
            if (parseInt(result.rows[0].count, 10) === 0) {
                break; // Exit the loop if the code is unique
            }
        }

        const dbquery = 'insert into users (username, firstname, lastname, emailid, password, referralcode) values ($1, $2, $3, $4, $5, $6)'
        await pool.query(dbquery, [username, firstname, lastname, emailid, hashedPassword, referralCode]);
        res.status(201).json({ message: 'User Regsitration successfull from backend'});
    } catch (err) {
        console.error('Error registering user:', err);
        res.status(500).json({ message: 'Error registering user' });
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const jwtSecret = process.env.JWT_SECRET;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
        const user = result.rows[0];

        if (user && (await bcrypt.compare(password, user.password))) {
            // Generate JWT
            const token = jwt.sign(
                {
                    userid: user.userid, // User ID
                    username: user.username, // Username (optional)
                    referralcode: user.referralcode, // Include referral code here
                },
                jwtSecret, 
                { expiresIn: '1h' }
            );
            res.status(200).json({ message: 'Login Successful from backend', token: token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({ message: 'Error logging in user' });
    }
});

router.get('/current-user', authenticateUser, async(req, res) => {
    try {
        const { username, referralcode } = req.user
        const query = 'select firstname,lastname,emailid, referralcode from users where username = $1'
        const result = await pool.query(query, [username])
        if (result.rows.length > 0) {
            const { firstname, referralcode, emailid, lastname } = result.rows[0];
            res.status(200).json({
                username,
                firstname,
                referralcode,
                emailid,
                lastname
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Internal Server Error' })
    }
})

// Protected Route (e.g., Referral Code)
router.get('/referral', authenticateUser, (req, res) => {
    res.status(200).json({ referralCode: req.user.referralCode });
});


// Add parent endpoint
router.post('/add-parent', async (req, res) => {
    const { childCode, parentCode } = req.body;

    try {
        // Step 1: Validate if parentCode exists in the database (users table)
        const parentResult = await pool.query('SELECT referralcode, username FROM users WHERE referralcode = $1', [parentCode]);
        if (parentResult.rows.length === 0) {
            return res.status(404).json({ message: 'Parent referral code does not exist' });
        }

        const parentUsername = parentResult.rows[0].username;

        // Step 2: If the parent is not "Company", apply the child limit restriction
        if (parentUsername !== 'Company') {
            // Count the number of children for this parent
            const childrenCountResult = await pool.query('SELECT COUNT(*) AS childcount FROM referrals WHERE parentcode = $1', [parentCode]);
            const childrenCount = parseInt(childrenCountResult.rows[0].childcount, 10);

            // Check if the parent already has 5 children
            if (childrenCount >= 5) {
                return res.status(400).json({ message: 'Parent already has the maximum number of children (5)' });
            }
        }

        // Step 3: Ensure childCode does not already have a parent
        const childResult = await pool.query('SELECT * FROM referrals WHERE childcode = $1', [childCode]);
        if (childResult.rows.length > 0) {
            return res.status(400).json({ message: 'Child already has a parent assigned' });
        }

        // Step 4: Insert the new parent-child relationship into the referrals table
        await pool.query(
            'INSERT INTO referrals (parentCode, childCode) VALUES ($1, $2)',
            [parentCode, childCode]
        );

        return res.status(201).json({ message: 'Parent assigned successfully' });
    } catch (error) {
        console.error('Error assigning parent:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/get-children', async (req, res) => {
    try {
        const userId = req.user.id; // Assuming `req.user` contains logged-in user info
        const userResult = await pool.query('SELECT referralcode FROM users WHERE id = $1', [userId]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const referralCode = userResult.rows[0].referralCode;

        // Check if this user has added a parent (is a member)
        const parentCheckResult = await pool.query('SELECT parentcode FROM referrals WHERE childcode = $1', [referralCode]);
        const isMember = parentCheckResult.rows.length > 0;

        // Fetch children for this user's referral code
        const childrenResult = await pool.query('SELECT childCode FROM referrals WHERE parentCode = $1', [referralCode]);

        return res.status(200).json({
            isMember,
            referralCode,
            children: childrenResult.rows.map((row) => row.childCode),
        });
    } catch (error) {
        console.error('Error fetching children:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.get('/get-company-code', async (req, res) => {
    try {
        const result = await pool.query('SELECT referralcode FROM users WHERE username = $1', ['Company']);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Company user not found' });
        }

        const referralCode = result.rows[0].referralcode;

        return res.status(200).json({ referralCode });
    } catch (error) {
        console.error('Error fetching company code:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/get-user-details', authenticateUser, async (req, res) => {
    try {
        const userReferralCode = req.user.referralcode; // Referral code of the logged-in user

        // Fetch parent information (if any)
        const parentResult = await pool.query(
            `
            SELECT u.username AS parent_name, u.referralcode AS parent_referralcode
            FROM referrals r
            INNER JOIN users u ON r.parentcode = u.referralcode
            WHERE r.childcode = $1
            `,
            [userReferralCode]
        );
        const parentInfo = parentResult.rows.length > 0 ? parentResult.rows[0] : null;

        // Fetch children information
        const childrenResult = await pool.query(
            `
            SELECT u.username AS child_name, u.referralcode AS child_referralcode
            FROM referrals r
            INNER JOIN users u ON r.childcode = u.referralcode
            WHERE r.parentcode = $1
            `,
            [userReferralCode]
        );
        const children = childrenResult.rows.map((row) => ({
            name: row.child_name,
            referralCode: row.child_referralcode,
        }));
        return res.status(200).json({
            parent: parentInfo ? { name: parentInfo.parent_name, referralCode: parentInfo.parent_referralcode } : null,
            children,
        });
    } catch (error) {
        console.error('Error in /get-user-details:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


const buildTree = async () => {
    // Step 1: Fetch parent-child relationships along with usernames from the database
    const result = await pool.query(`
        SELECT 
            p.username AS parent_username, 
            p.referralcode AS parent_referralcode, 
            c.username AS child_username, 
            c.referralcode AS child_referralcode 
        FROM referrals r
        LEFT JOIN users p ON r.parentcode = p.referralcode
        LEFT JOIN users c ON r.childcode = c.referralcode
    `);
    const relationships = result.rows;

    // Step 2: Fetch the Company user from the database
    const companyResult = await pool.query(`
        SELECT username, referralcode 
        FROM users 
        WHERE username = 'Company'
    `);

    if (companyResult.rows.length === 0) {
        throw new Error('Company user not found in the database');
    }

    const companyUser = companyResult.rows[0];
    const root = { 
        name: companyUser.username, // Use username for the name field
        referralCode: companyUser.referralcode,
        children: [] 
    };

    // Step 3: Create a map to store nodes by referral code
    const nodes = { [companyUser.referralcode]: root }; // Initialize map with the Company node

    relationships.forEach(({ parent_username, parent_referralcode, child_username, child_referralcode }) => {
        // Ensure the parent node exists
        if (!nodes[parent_referralcode]) {
            nodes[parent_referralcode] = { 
                name: parent_username, // Use parent_username for the name
                referralCode: parent_referralcode,
                children: [] 
            };
        }
        const parentNode = nodes[parent_referralcode];

        // Ensure the child node exists
        if (!nodes[child_referralcode]) {
            nodes[child_referralcode] = { 
                name: child_username, // Use child_username for the name
                referralCode: child_referralcode,
                children: [] 
            };
        }
        const childNode = nodes[child_referralcode];

        // Add the child to the parent's children array (if not already added)
        if (!parentNode.children.some(child => child.referralCode === childNode.referralCode)) {
            parentNode.children.push(childNode);
        }
    });

    // Step 4: Return the root node
    return root;
};

router.get('/get-tree', async (req, res) => {
    try {
        const tree = await buildTree(); // Use the buildTree function
        res.status(200).json(tree);
    } catch (error) {
        console.error('Error building tree:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/get-parent-information',authenticateUser, async (req, res) => {
    try {
        const tree = await buildTree();
        const userReferralCode = req.user.referralcode;
        const parentHierarchy = getParentHierarchy(tree, userReferralCode);

        if (!parentHierarchy || parentHierarchy.length === 0) {
            return res.status(404).json({ message: 'No parent hierarchy found for the user.' });
        }
        res.status(200).json({parentHierarchy});
        return parentHierarchy.slice(0, 10);
    } catch (error) {
        console.error('Error fetching parents information while forming tree:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/get-parent-information-exclude-company',authenticateUser, async (req, res) => {
    try {
        const tree = await buildTree();
        const userReferralCode = req.user.referralcode;
        let parentHierarchy = getParentHierarchy(tree, userReferralCode);

        if (!parentHierarchy || parentHierarchy.length === 0) {
            return res.status(404).json({ message: 'No parent hierarchy found for the user.' });
        }
        // Exclude any node with username 'Company'
        parentHierarchy = parentHierarchy.filter(parent => parent.name !== 'Company');

        res.status(200).json({parentHierarchy});
        return parentHierarchy.slice(0, 10);
    } catch (error) {
        console.error('Error fetching parents information while forming tree:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

router.post('/update-wallets', authenticateUser, async (req, res) => {
    const { parentDistribution, currentUser, company } = req.body;

    try {
        // Update current user's wallet
        await pool.query(
            'UPDATE users SET wallet = wallet + $1 WHERE username = $2',
            [currentUser.coins, currentUser.name]
        );

        // Update company's wallet
        await pool.query(
            'UPDATE users SET wallet = wallet + $1 WHERE username = $2',
            [company.coins, company.name]
        );

        // Update parent wallets
        for (const parent of parentDistribution) {
            await pool.query(
                'UPDATE users SET wallet = wallet + $1 WHERE username = $2',
                [parent.coins, parent.name]
            );
        }

        res.status(200).json({ message: 'Wallets updated successfully' });
    } catch (error) {
        console.error('Error updating wallets:', error);
        res.status(500).json({ message: 'Failed to update wallets' });
    }
});


module.exports = router;
