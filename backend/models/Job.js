const mongoose = require('mongoose');

const jobSchema = mongoose.Schema(
    {
        recruiter: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        title: {
            type: String,
            required: true,
        },
        company: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        requirements: [String],
        salary: {
            type: Number,
        },
        jobType: {
            type: String,
            enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
            default: 'Full-time',
        },
        skillsRequired: [String],
        category: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['Open', 'Closed'],
            default: 'Open',
        },
    },
    {
        timestamps: true,
    }
);

const Job = mongoose.model('Job', jobSchema);

module.exports = Job;
