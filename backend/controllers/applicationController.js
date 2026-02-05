const Application = require('../models/Application');
const Job = require('../models/Job');

// @desc    Apply for a job
// @route   POST /api/applications
// @access  Private (JobSeeker)
const applyToJob = async (req, res) => {
    try {
        const { jobId, resume } = req.body;
        console.log(`Application attempt by ${req.user.email} for job ${jobId}`);

        const job = await Job.findById(jobId);
        if (!job) {
            console.log('Apply Error: Job not found');
            return res.status(404).json({ message: 'Job not found' });
        }

        const alreadyApplied = await Application.findOne({
            job: jobId,
            applicant: req.user._id,
        });

        if (alreadyApplied) {
            console.log('Apply Error: Already applied');
            return res.status(400).json({ message: 'You have already applied for this job' });
        }

        const application = await Application.create({
            job: jobId,
            applicant: req.user._id,
            recruiter: job.recruiter,
            resume: resume || (req.user.profile ? req.user.profile.resume : 'not_provided'),
        });

        console.log('Application created successfully');
        res.status(201).json(application);
    } catch (err) {
        console.error('Apply Error:', err.message);
        res.status(500).json({ message: 'Server error during application' });
    }
};

// @desc    Get user applications
// @route   GET /api/applications/my
// @access  Private (JobSeeker)
const getMyApplications = async (req, res) => {
    const applications = await Application.find({ applicant: req.user._id })
        .populate('job', 'title company location')
        .sort('-createdAt');
    res.json(applications);
};

// @desc    Withdraw application
// @route   DELETE /api/applications/:id
// @access  Private (JobSeeker)
const withdrawApplication = async (req, res) => {
    const application = await Application.findById(req.params.id);

    if (application) {
        if (application.applicant.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await application.deleteOne();
        res.json({ message: 'Application withdrawn' });
    } else {
        res.status(404).json({ message: 'Application not found' });
    }
};

module.exports = { applyToJob, getMyApplications, withdrawApplication };
