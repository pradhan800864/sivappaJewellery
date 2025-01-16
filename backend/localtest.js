const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    host: 'localhost',
    database: 'pocproject',
    password: '',
    port: 5432,
});

const createAdmin = async () => {
    try {
        const username = 'admin';
        const password = 'admin123';

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert into the admin table
        await pool.query('INSERT INTO admin (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        console.log('Admin account created successfully.');

    } catch (error) {
        console.error('Error creating admin account:', error);
    } finally {
        pool.end(); // Close the database connection
    }
};

createAdmin();
