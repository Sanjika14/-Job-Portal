import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ManageJobs = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/recruiter/jobs`, config);
                setJobs(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching jobs');
                setLoading(false);
            }
        };
        if (user) fetchJobs();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job and all its applications?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/recruiter/jobs/${id}`, config);
            setJobs(jobs.filter(job => job._id !== id));
            alert('Job deleted');
        } catch (err) {
            alert('Delete failed');
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container manage-jobs-page">
            <div className="page-header glass">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Manage Job Postings</h1>
                        <p>Track your active jobs and view applicants</p>
                    </div>
                    <Link to="/post-job" className="btn btn-primary">Post New Job</Link>
                </div>
            </div>

            <div className="jobs-table-container glass">
                <table className="jobs-table">
                    <thead>
                        <tr>
                            <th>Job Title</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.length > 0 ? (
                            jobs.map((job) => (
                                <tr key={job._id}>
                                    <td><strong>{job.title}</strong></td>
                                    <td>
                                        <span className={`status-badge ${job.status.toLowerCase()}`}>
                                            {job.status}
                                        </span>
                                    </td>
                                    <td>{new Date(job.createdAt).toLocaleDateString()}</td>
                                    <td className="actions-cell">
                                        <Link to={`/job-applicants/${job._id}`} className="btn-link">View Applicants</Link>
                                        <button onClick={() => handleDelete(job._id)} className="btn-delete">Delete</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No jobs posted yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            <style>{`
                .manage-jobs-page::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
                    background-size: cover;
                    z-index: -1;
                }
                .manage-jobs-page { position: relative; z-index: 1; padding-top: 4rem; padding-bottom: 4rem; }
                .page-header { padding: 3rem; margin-bottom: 3rem; background: rgba(20, 20, 20, 0.6) !important; border: 1px solid rgba(212, 175, 55, 0.2); }
                .jobs-table-container { 
                    padding: 2.5rem; 
                    background: rgba(20, 20, 20, 0.5) !important; 
                    border: 1px solid rgba(212, 175, 55, 0.1); 
                }
                .jobs-table { width: 100%; border-collapse: collapse; }
                .jobs-table th { color: var(--primary); font-weight: 700; text-transform: uppercase; font-size: 0.85rem; padding: 1.5rem 1rem; border-bottom: 2px solid rgba(212, 175, 55, 0.1); }
                .jobs-table td { padding: 1.5rem 1rem; border-bottom: 1px solid rgba(255, 255, 255, 0.05); color: #fff; }
                .status-badge { padding: 0.3rem 1rem; border-radius: 0.5rem; font-weight: 700; font-size: 0.8rem; text-transform: uppercase; }
                .status-badge.open { background: rgba(34, 197, 94, 0.1); color: #22c55e; border: 1px solid rgba(34, 197, 94, 0.2); }
                .btn-delete { color: #ef4444; font-weight: 700; border: 1px solid rgba(239, 68, 68, 0.2); padding: 0.4rem 1rem; border-radius: 0.5rem; transition: all 0.3s; }
                .btn-delete:hover { background: #ef4444; color: #fff; }
      `}</style>
        </div>
    );
};

export default ManageJobs;
