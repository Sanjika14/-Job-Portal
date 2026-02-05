const express = require('express');
const {
    getUsers,
    deleteUser,
    getAllJobs,
    updateJobStatus,
    getAnalytics,
    exportJobsCSV
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

router.get('/jobs', getAllJobs);
router.put('/jobs/:id', updateJobStatus);

router.get('/analytics', getAnalytics);

router.get('/export/jobs', exportJobsCSV);

module.exports = router;
