const User = require('../models/User');

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            console.log(`Updating profile for user: ${user.email} (Role: ${user.role})`);
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            if (req.body.password) {
                user.password = req.body.password;
            }

            // Role specific profile updates
            if (user.role === 'jobseeker') {
                if (!user.profile) {
                    user.profile = {};
                }
                user.profile = {
                    ...user.profile,
                    bio: req.body.bio !== undefined ? req.body.bio : (user.profile.bio || ''),
                    skills: req.body.skills !== undefined ? req.body.skills : (user.profile.skills || []),
                    education: req.body.education !== undefined ? req.body.education : (user.profile.education || []),
                    experience: req.body.experience !== undefined ? req.body.experience : (user.profile.experience || []),
                    visibility: req.body.visibility !== undefined ? req.body.visibility : (user.profile.visibility !== undefined ? user.profile.visibility : true),
                };
            } else if (user.role === 'recruiter') {
                user.company = {
                    ...user.company,
                    name: req.body.companyName || user.company.name,
                    description: req.body.companyDescription || user.company.description,
                    website: req.body.companyWebsite || user.company.website,
                    location: req.body.companyLocation || user.company.location,
                };
            }

            const updatedUser = await user.save();
            console.log('Profile updated successfully in DB');

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                profile: updatedUser.profile,
                company: updatedUser.company,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('SERVER ERROR IN updateUserProfile:', error);
        res.status(500).json({ message: error.message });
    }
};

// @desc    Upload resume
// @route   POST /api/auth/resume
// @access  Private
const uploadResume = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user && user.role === 'jobseeker') {
            if (!user.profile) {
                user.profile = {};
            }
            user.profile.resume = `/${req.file.path.replace(/\\/g, '/')}`;

            await user.save();
            console.log(`Resume uploaded successfully for user: ${user.email}`);
            res.json({ message: 'Resume uploaded successfully', resume: user.profile.resume });
        } else {
            res.status(404).json({ message: 'User not found or not a jobseeker' });
        }
    } catch (error) {
        console.error('SERVER ERROR IN uploadResume:', error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateUserProfile, uploadResume };
