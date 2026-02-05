const Job = require('../models/Job');
const Application = require('../models/Application');
const createNotification = require('../utils/notificationUtil');

// @desc    Create new job
// @route   POST /api/recruiter/jobs
// @access  Private (Recruiter)
const createJob = async (req, res) => {
    const { title, company, location, description, requirements, salary, jobType, category } = req.body;

    const job = await Job.create({
        recruiter: req.user._id,
        title,
        company,
        location,
        description,
        requirements,
        salary,
        jobType,
        category,
    });

    res.status(201).json(job);
};

// @desc    Get recruiter posted jobs
// @route   GET /api/recruiter/jobs
// @access  Private (Recruiter)
const getRecruiterJobs = async (req, res) => {
    const jobs = await Job.find({ recruiter: req.user._id }).sort('-createdAt');
    res.json(jobs);
};

// @desc    Update job
// @route   PUT /api/recruiter/jobs/:id
// @access  Private (Recruiter)
const updateJob = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        job.title = req.body.title || job.title;
        job.company = req.body.company || job.company;
        job.location = req.body.location || job.location;
        job.description = req.body.description || job.description;
        job.requirements = req.body.requirements || job.requirements;
        job.salary = req.body.salary || job.salary;
        job.jobType = req.body.jobType || job.jobType;
        job.category = req.body.category || job.category;
        job.status = req.body.status || job.status;

        const updatedJob = await job.save();
        res.json(updatedJob);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// @desc    Delete job
// @route   DELETE /api/recruiter/jobs/:id
// @access  Private (Recruiter)
const deleteJob = async (req, res) => {
    const job = await Job.findById(req.params.id);

    if (job) {
        if (job.recruiter.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        await Application.deleteMany({ job: job._id });
        await job.deleteOne();
        res.json({ message: 'Job and associated applications removed' });
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

// @desc    Get applicants for a job
// @route   GET /api/recruiter/jobs/:id/applicants
// @access  Private (Recruiter)
const getApplicants = async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job || job.recruiter.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized or job not found' });
    }

    const applicants = await Application.find({ job: req.params.id })
        .populate('applicant', 'name email profile')
        .sort('-createdAt');
    res.json(applicants);
};

// @desc    Update application status
// @route   PUT /api/recruiter/applications/:id
// @access  Private (Recruiter)
const updateApplicationStatus = async (req, res) => {
    const application = await Application.findById(req.params.id);

    if (application) {
        if (application.recruiter.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }
        application.status = req.body.status || application.status;
        const updatedApplication = await application.save();

        // Notify Job Seeker
        const job = await Job.findById(application.job);
        await createNotification(
            application.applicant,
            `Your application for ${job.title} has been marked as ${application.status}.`,
            'status_change',
            '/applied-jobs'
        );

        res.json(updatedApplication);
    } else {
        res.status(404).json({ message: 'Application not found' });
    }
};

module.exports = {
    createJob,
    getRecruiterJobs,
    updateJob,
    deleteJob,
    getApplicants,
    updateApplicationStatus,
};
