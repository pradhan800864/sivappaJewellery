const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminAuthRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(authRoutes);
app.use('/admin', adminRoutes);

// Start Server
const PORT = 4999;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} from app.js file`);
});
