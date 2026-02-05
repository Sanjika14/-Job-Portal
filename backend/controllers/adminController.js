const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');
const { Parser } = require('json2csv');

// --- User Management ---

// @desc    Get all users
// @route   GET /api/admin/users
const getUsers = async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
};

// @desc    Deactivate/Delete user
// @route   DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin' });
        }
        await user.deleteOne();
        res.json({ message: 'User removed' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// --- Job Management ---

// @desc    Get all jobs
// @route   GET /api/admin/jobs
const getAllJobs = async (req, res) => {
    const jobs = await Job.find({}).populate('recruiter', 'name email');
    res.json(jobs);
};

// @desc    Update job status (Approve/Reject/Remove)
// @route   PUT /api/admin/jobs/:id
const updateJobStatus = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (job) {
        job.status = req.body.status || job.status;
        const updatedJob = await job.save();
        res.json(updatedJob);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// --- Analytics ---

// @desc    Get system analytics
// @route   GET /api/admin/analytics
const getAnalytics = async (req, res) => {
    const totalUsers = await User.countDocuments();
    const totalJobs = await Job.countDocuments();
    const totalApplications = await Application.countDocuments();

    const seekerCount = await User.countDocuments({ role: 'jobseeker' });
    const recruiterCount = await User.countDocuments({ role: 'recruiter' });

    // Mock monthly data for charts
    const monthlyActivity = [
        { month: 'Jan', users: 40, jobs: 20 },
        { month: 'Feb', users: 55, jobs: 35 },
        { month: 'Mar', users: 80, jobs: 50 },
    ];

    res.json({
        totalUsers,
        totalJobs,
        totalApplications,
        userBreakdown: { seekerCount, recruiterCount },
        monthlyActivity
    });
};

// --- Export Functionality ---

// @desc    Export all jobs to CSV
// @route   GET /api/admin/export/jobs
const exportJobsCSV = async (req, res) => {
    try {
        const jobs = await Job.find({}).lean();
        const fields = ['title', 'company', 'location', 'salary', 'jobType', 'category', 'status', 'createdAt'];
        const json2csvParser = new Parser({ fields });
        const csv = json2csvParser.parse(jobs);

        res.header('Content-Type', 'text/csv');
        res.attachment('jobs_export.csv');
        return res.send(csv);
    } catch (err) {
        res.status(500).json({ message: 'Error exporting CSV' });
    }
};

module.exports = {
    getUsers,
    deleteUser,
    getAllJobs,
    updateJobStatus,
    getAnalytics,
    exportJobsCSV
};
