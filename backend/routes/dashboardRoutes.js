const express = require('express');
const { getJobSeekerDashboard, getRecruiterDashboard } = require('../controllers/dashboardController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.get('/jobseeker', authorize('jobseeker'), getJobSeekerDashboard);
router.get('/recruiter', authorize('recruiter'), getRecruiterDashboard);

module.exports = router;
