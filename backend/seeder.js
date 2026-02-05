const mongoose = require('mongoose');
const dotenv = require('dotenv');
const jobs = require('./data/jobs');
const Job = require('./models/Job');
const User = require('./models/User');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
    try {
        await Job.deleteMany();
        await User.deleteMany();

        // Create a default recruiter
        const admin = await User.create({
            name: 'System Admin',
            email: 'admin@jobportal.com',
            password: 'password123',
            role: 'admin',
            isVerified: true
        });

        const recruiter = await User.create({
            name: 'Default Recruiter',
            email: 'recruiter@jobportal.com',
            password: 'password123',
            role: 'recruiter',
            isVerified: true
        });

        const sampleJobs = jobs.map(job => {
            return { ...job, recruiter: recruiter._id };
        });

        await Job.insertMany(sampleJobs);

        console.log('Data Imported Successfully!');
        console.log('--- Credentials ---');
        console.log('Admin: admin@jobportal.com / password123');
        console.log('Recruiter: recruiter@jobportal.com / password123');
        process.exit();
    } catch (error) {
        console.error(`Error with data import: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Job.deleteMany();
        await User.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error with data destruction: ${error.message}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
