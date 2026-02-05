import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const RecruiterDashboard = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5055/api/dashboard/recruiter', config);
                setData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching dashboard');
                setLoading(false);
            }
        };
        if (user) fetchDashboard();
    }, [user]);

    if (loading) return <div className="container">Loading Dashboard...</div>;

    return (
        <div className="container dashboard-page">
            <div className="dashboard-header glass">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>Recruiter Dashboard</h1>
                        <p>Manage your postings and keep track of candidates.</p>
                    </div>
                    <Link to="/post-job" className="btn btn-primary">Post New Job</Link>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <h3>Active Jobs</h3>
                    <p className="stat-number">{data.jobsCount}</p>
                    <Link to="/manage-jobs" className="stat-link">Manage current jobs</Link>
                </div>
                <div className="stat-card glass">
                    <h3>Total Applicants</h3>
                    <p className="stat-number">{data.totalApplicants}</p>
                    <span className="stat-label">Across all jobs</span>
                </div>
                <div className="stat-card glass">
                    <h3>Shortlisted</h3>
                    <p className="stat-number">{data.shortlistedCount}</p>
                    <span className="stat-label">Candidates to review</span>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-section glass">
                    <h3>Recently Posted Jobs</h3>
                    <div className="recent-list">
                        {data.recentJobs.length > 0 ? (
                            data.recentJobs.map(job => (
                                <div key={job._id} className="recent-item">
                                    <div>
                                        <strong>{job.title}</strong>
                                        <p>{job.category} • {job.location}</p>
                                    </div>
                                    <Link to={`/job-applicants/${job._id}`} className="btn-text">View Applicants</Link>
                                </div>
                            ))
                        ) : (
                            <p>No jobs posted yet.</p>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .dashboard-page { padding-top: 2rem; padding-bottom: 4rem; }
        .dashboard-header { padding: 3rem; margin-bottom: 3rem; background: rgba(255, 255, 255, 0.8) !important; border-radius: 2rem; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3rem; }
        .stat-card { padding: 2.5rem; text-align: center; background: rgba(255, 255, 255, 0.8) !important; border-radius: 2rem; }
        .stat-number { font-size: 3rem; font-weight: 900; color: var(--primary); margin: 0.5rem 0; }
        .stat-label { color: var(--gray); font-size: 1rem; font-weight: 600; }
        .stat-link { color: var(--primary); font-size: 0.95rem; text-decoration: underline; font-weight: 600; }

        .recent-section { padding: 2.5rem; background: rgba(255, 255, 255, 0.8) !important; border-radius: 2rem; }
        .recent-list { margin: 1.5rem 0; }
        .recent-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #f1f5f9; }
        .btn-text { color: var(--primary); font-weight: 600; font-size: 0.95rem; }
      `}</style>
        </div>
    );
};

export default RecruiterDashboard;
