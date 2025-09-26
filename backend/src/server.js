require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const connectDB = require('./config/db');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/user');
const analyticsRoutes = require('./routes/analytics');

const app = express();
app.use(cors());
app.use(bodyParser.json());

connectDB();

app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log('Server running on port', PORT));
