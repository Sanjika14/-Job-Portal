import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const SavedJobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSavedJobs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/saved-jobs`, config);
                setJobs(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching saved jobs');
                setLoading(false);
            }
        };
        if (user) fetchSavedJobs();
    }, [user]);

    const handleRemove = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/auth/save-job/${id}`, config);
            setJobs(jobs.filter(job => job._id !== id));
        } catch (err) {
            alert('Failed to remove job');
        }
    };

    if (loading) return <div className="container">Loading saved jobs...</div>;

    return (
        <div className="container saved-jobs-page">
            <div className="page-header glass">
                <h1>Saved Jobs</h1>
                <p>Your bookmarked opportunities</p>
            </div>

            <div className="jobs-grid">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className="job-card glass">
                            <h3>{job.title}</h3>
                            <p className="company">{job.company}</p>
                            <p className="location">{job.location}</p>
                            <div className="job-actions">
                                <Link to={`/jobs/${job._id}`} className="btn-link">View Details</Link>
                                <button onClick={() => handleRemove(job._id)} className="btn-remove">Remove</button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No saved jobs yet.</p>
                )}
            </div>

            <style>{`
        .saved-jobs-page { padding-top: 2rem; }
        .page-header { padding: 2rem; margin-bottom: 2rem; }
        .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .job-card { padding: 1.5rem; }
        .company { color: var(--primary); font-weight: 600; }
        .location { color: var(--gray); font-size: 0.9rem; margin-bottom: 1rem; }
        .job-actions { display: flex; justify-content: space-between; }
        .btn-link { font-weight: 600; color: var(--primary); }
        .btn-remove { background: none; border: none; color: var(--error); cursor: pointer; font-weight: 600; }
      `}</style>
        </div>
    );
};

export default SavedJobs;
