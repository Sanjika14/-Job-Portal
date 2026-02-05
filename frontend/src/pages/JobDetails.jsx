import { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5055/api/jobs/${id}`);
                setJob(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching job details');
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.role !== 'jobseeker') {
            alert(`You are logged in as a ${user.role}. Only Job Seekers can apply for jobs. Please log out and register as a Job Seeker to test this feature.`);
            return;
        }

        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.post('http://localhost:5055/api/applications', { jobId: id }, config);
            alert('Application submitted successfully!');
            navigate('/applied-jobs');
        } catch (err) {
            console.error('Detailed Apply Error:', err.response?.data || err.message);
            alert(err.response?.data?.message || 'Failed to apply. Check console for details.');
        }
    };

    const handleSave = async () => {
        if (!user) { navigate('/login'); return; }
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.post(`http://localhost:5055/api/auth/save-job/${id}`, {}, config);
            alert('Job bookmarked!');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save job');
        }
    };

    if (loading) return <div className="container">Loading...</div>;
    if (!job) return <div className="container">Job not found</div>;

    return (
        <div className="container job-details-page">
            <div className="job-header glass">
                <div className="header-info">
                    <h1>{job.title}</h1>
                    <p className="company">{job.company}</p>
                    <div className="tags">
                        <span className="tag">{job.jobType}</span>
                        <span className="tag">{job.category}</span>
                        <span className="tag">{job.location}</span>
                    </div>
                </div>
                <div className="header-action">
                    <p className="salary">{job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}</p>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={handleSave} className="btn-save">Bookmark</button>
                        <button onClick={handleApply} className="btn btn-primary">Apply Now</button>
                    </div>
                </div>
            </div>

            <div className="job-content">
                <section className="glass content-section">
                    <h3>Description</h3>
                    <p>{job.description}</p>
                </section>

                <section className="glass content-section">
                    <h3>Requirements</h3>
                    <ul>
                        {job.requirements.map((req, index) => (
                            <li key={index}>{req}</li>
                        ))}
                    </ul>
                </section>

                <section className="glass content-section">
                    <h3>Skills Required</h3>
                    <div className="skills-list">
                        {job.skillsRequired.map((skill, index) => (
                            <span key={index} className="skill-badge">{skill}</span>
                        ))}
                    </div>
                </section>
            </div>

            <style>{`
        .job-details-page { padding-top: 2rem; }
        .job-header { padding: 2.5rem; display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
        .company { font-size: 1.25rem; color: var(--primary); font-weight: 600; margin-top: 0.5rem; }
        .tags { display: flex; gap: 0.75rem; margin-top: 1rem; }
        .tag { background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 0.35rem 0.75rem; border-radius: 99px; font-size: 0.85rem; font-weight: 500; border: 1px solid rgba(99, 102, 241, 0.2); }
        .salary { font-size: 1.5rem; font-weight: 800; text-align: right; margin-bottom: 1rem; }
        
        .job-content { display: grid; gap: 2rem; }
        .content-section { padding: 2rem; }
        .content-section h3 { margin-bottom: 1rem; color: var(--dark); border-bottom: 2px solid var(--primary); display: inline-block; padding-bottom: 0.25rem; }
        .content-section p { line-height: 1.8; color: var(--gray); }
        .content-section ul { padding-left: 1.25rem; color: var(--gray); line-height: 1.8; }
        .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; }
        .skill-badge { background: rgba(99, 102, 241, 0.1); color: var(--primary); padding: 0.25rem 0.75rem; border-radius: 4px; font-size: 0.9rem; border: 1px solid rgba(99, 102, 241, 0.3); font-weight: 600; }
      `}</style>
        </div>
    );
};

export default JobDetails;
