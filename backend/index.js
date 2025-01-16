const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();
const { generateReferralCode } = require('./src/utils/utils')
const jwt = require('jsonwebtoken');
const app = express();
const port = 4999;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// PostgreSQL connection
const pool = new Pool({
    user: "postgres",
    host: 'localhost',
    database: 'pocproject',
    password: '',
    port: 5432,
});

app.get('/', (req, res) => {
    res.send('API is running');
});

// Example endpoint
app.get('/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM persons');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});


app.post('/register', async (req, res) => {
    const { username, firstname, lastname, emailid, password} = req.body;
    let referralCode;

    // Generate a unique referral code
    while (true) {
        referralCode = generateReferralCode(); // Call your utility function
        console.log("Referral code ", referralCode)
        const result = await pool.query('SELECT COUNT(*) FROM users WHERE referralcode = $1', [referralCode]);
        console.log("result variable from DB ", result)
        if (parseInt(result.rows[0].count, 10) === 0) {
            break; // Exit the loop if the code is unique
        }
    }

    const dbquery = 'insert into users (username, firstname, lastname, emailid, password, referralcode) values ($1, $2, $3, $4, $5, $6)'

    try {
        await pool.query(dbquery, [username, firstname, lastname, emailid, password, referralCode])
        res.status(201).json({message: 'User Regsitration successfull from backend'})
    } catch (error) {
        console.error('Error inserting data:', error);
        res.status(500).json({message: error})
    }
})


app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = $1';
    
    try {
        // Check if user exists
        const result = await pool.query(query, [username]);

        if (result.rows.length > 0) {
            const user = result.rows[0];

            // Check if password matches
            if (user.password === password) {
                console.log('Login successful');
                // Send success response with user data or token (optional)
                res.status(200).json({ message: 'Login successful', user: user });
            } else {
                res.status(401).json({ message: 'Invalid password' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
