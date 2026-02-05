const User = require('../models/User');

// @desc    Save/Bookmark a job
// @route   POST /api/auth/save-job/:id
// @access  Private (JobSeeker)
const saveJob = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user.savedJobs.includes(req.params.id)) {
        return res.status(400).json({ message: 'Job already saved' });
    }
    user.savedJobs.push(req.params.id);
    await user.save();
    res.json({ message: 'Job saved successfully' });
};

// @desc    Remove saved job
// @route   DELETE /api/auth/save-job/:id
// @access  Private (JobSeeker)
const removeSavedJob = async (req, res) => {
    const user = await User.findById(req.user._id);
    user.savedJobs = user.savedJobs.filter(id => id.toString() !== req.params.id);
    await user.save();
    res.json({ message: 'Job removed from saved' });
};

// @desc    Get saved jobs
// @route   GET /api/auth/saved-jobs
// @access  Private (JobSeeker)
const getSavedJobs = async (req, res) => {
    const user = await User.findById(req.user._id).populate('savedJobs');
    res.json(user.savedJobs);
};

module.exports = { saveJob, removeSavedJob, getSavedJobs };
