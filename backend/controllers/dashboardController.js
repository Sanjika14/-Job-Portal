const Job = require('../models/Job');
const Application = require('../models/Application');
const User = require('../models/User');

// @desc    Get Job Seeker Dashboard data
// @route   GET /api/dashboard/jobseeker
// @access  Private (JobSeeker)
const getJobSeekerDashboard = async (req, res) => {
    const applicationsCount = await Application.countDocuments({ applicant: req.user._id });
    const savedJobsCount = (await User.findById(req.user._id)).savedJobs.length;

    const recentApplications = await Application.find({ applicant: req.user._id })
        .populate('job', 'title company')
        .sort('-createdAt')
        .limit(5);

    const pendingCount = await Application.countDocuments({ applicant: req.user._id, status: 'Pending' });
    const acceptedCount = await Application.countDocuments({ applicant: req.user._id, status: 'Accepted' });

    res.json({
        applicationsCount,
        savedJobsCount,
        recentApplications,
        stats: {
            pending: pendingCount,
            accepted: acceptedCount,
        }
    });
};

// @desc    Get Recruiter Dashboard data
// @route   GET /api/dashboard/recruiter
// @access  Private (Recruiter)
const getRecruiterDashboard = async (req, res) => {
    const jobsCount = await Job.countDocuments({ recruiter: req.user._id });
    const totalApplicants = await Application.countDocuments({ recruiter: req.user._id });

    const recentJobs = await Job.find({ recruiter: req.user._id })
        .sort('-createdAt')
        .limit(5);

    const shortlistedCount = await Application.countDocuments({ recruiter: req.user._id, status: 'Reviewed' });

    res.json({
        jobsCount,
        totalApplicants,
        recentJobs,
        shortlistedCount
    });
};

module.exports = { getJobSeekerDashboard, getRecruiterDashboard };
