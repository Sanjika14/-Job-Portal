const express = require("express");
require("dotenv").config();
const cors = require('cors');
const mongoose = require("mongoose");
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const recruiterRoutes = require('./routes/recruiterRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const adminRoutes = require('./routes/adminRoutes');
const User = require("./models/User");



dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log(err));

const app = express();

app.use(cors({
    origin: ["http://localhost:5173", "http://localhost:3000", "https://job-portal-4vht.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes are handled by middleware below



app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/recruiter', recruiterRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Job Portal API is running - VERSION 2.0.0 (CONFIRMED)');
});


// Error handling middleware
app.use((err, req, res, next) => {
    console.error('SERVER ERROR:', err.stack);
    res.status(500).json({
        message: err.message,
        stack: err.stack,
    });
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(`SERVER RUNNING ON PORT ${PORT}`);
    console.log(`VERSION 2.0.0 (CONSOLIDATED AUTH)`);
    console.log(`========================================`);
});

