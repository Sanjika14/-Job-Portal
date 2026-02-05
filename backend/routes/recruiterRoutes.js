const express = require('express');
const {
    createJob,
    getRecruiterJobs,
    updateJob,
    deleteJob,
    getApplicants,
    updateApplicationStatus,
} = require('../controllers/recruiterController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('recruiter'));

router.route('/jobs')
    .post(createJob)
    .get(getRecruiterJobs);

router.route('/jobs/:id')
    .put(updateJob)
    .delete(deleteJob);

router.get('/jobs/:id/applicants', getApplicants);
router.put('/applications/:id', updateApplicationStatus);

module.exports = router;
