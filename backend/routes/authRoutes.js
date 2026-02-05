const express = require('express');
const {
    registerUser,
    loginUser,
    getUserProfile,
    verifyEmail,
    forgotPassword,
    resetPassword,
} = require('../controllers/authController');
const {
    updateUserProfile,
    uploadResume,
} = require('../controllers/profileController');
const {
    saveJob,
    removeSavedJob,
    getSavedJobs,
} = require('../controllers/savedJobsController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/resume', protect, upload.single('resume'), uploadResume);



router.get('/verify/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:token', resetPassword);

router.post('/save-job/:id', protect, authorize('jobseeker'), saveJob);
router.delete('/save-job/:id', protect, authorize('jobseeker'), removeSavedJob);
router.get('/saved-jobs', protect, authorize('jobseeker'), getSavedJobs);

module.exports = router;
