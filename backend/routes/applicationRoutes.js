const express = require('express');
const {
    applyToJob,
    getMyApplications,
    withdrawApplication,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('jobseeker'));

router.post('/', applyToJob);
router.get('/my', getMyApplications);
router.delete('/:id', withdrawApplication);

module.exports = router;
