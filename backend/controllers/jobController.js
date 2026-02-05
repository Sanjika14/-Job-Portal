const Job = require('../models/Job');

// @desc    Get all jobs with filters
// @route   GET /api/jobs
// @access  Public
const getJobs = async (req, res) => {
    const { keyword, location, company, skills, sort, type, minSalary } = req.query;

    let query = {};

    if (keyword) {
        query.$or = [
            { title: { $regex: keyword, $options: 'i' } },
            { description: { $regex: keyword, $options: 'i' } },
            { company: { $regex: keyword, $options: 'i' } },
            { skillsRequired: { $regex: keyword, $options: 'i' } },
            { category: { $regex: keyword, $options: 'i' } },
        ];
    }
    if (location) {
        query.location = { $regex: location, $options: 'i' };
    }
    if (company) {
        query.company = { $regex: company, $options: 'i' };
    }
    if (skills) {
        const skillsArray = skills.split(',');
        query.skillsRequired = { $in: skillsArray };
    }
    if (type) {
        query.jobType = type;
    }
    if (minSalary) {
        query.salary = { $gte: Number(minSalary) };
    }

    let apiQuery = Job.find(query);

    // Sorting
    if (sort === 'latest') {
        apiQuery = apiQuery.sort('-createdAt');
    } else if (sort === 'salary') {
        apiQuery = apiQuery.sort('-salary');
    } else {
        apiQuery = apiQuery.sort('-createdAt'); // Default relevance as latest for now
    }

    const jobs = await apiQuery.populate('recruiter', 'name email');
    res.json(jobs);
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Public
const getJobById = async (req, res) => {
    const job = await Job.findById(req.params.id).populate('recruiter', 'name email');
    if (job) {
        res.json(job);
    } else {
        res.status(404).json({ message: 'Job not found' });
    }
};

module.exports = { getJobs, getJobById };
