import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobSeekerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard/jobseeker`, config);
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
                <h1>Welcome, {user.name}!</h1>
                <p>Here's what's happening with your job search today.</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <h3>Applications</h3>
                    <p className="stat-number">{data.applicationsCount}</p>
                    <span className="stat-label">{data.stats.pending} Pending</span>
                </div>
                <div className="stat-card glass">
                    <h3>Saved Jobs</h3>
                    <p className="stat-number">{data.savedJobsCount}</p>
                    <Link to="/saved-jobs" className="stat-link">View saved</Link>
                </div>
                <div className="stat-card glass">
                    <h3>Offers</h3>
                    <p className="stat-number">{data.stats.accepted}</p>
                    <span className="stat-label">Accepted jobs</span>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="recent-section glass">
                    <h3>Recent Applications</h3>
                    <div className="recent-list">
                        {data.recentApplications.length > 0 ? (
                            data.recentApplications.map(app => (
                                <div key={app._id} className="recent-item">
                                    <div style={{ flex: 1 }}>
                                        <strong>{app.job.title}</strong>
                                        <p>{app.job.company}</p>
                                    </div>
                                    <div className="mini-track">
                                        <div className={`track-dot ${app.status === 'Pending' ? 'active' : 'done'}`}></div>
                                        <div className={`track-dot ${app.status === 'Reviewed' ? 'active' : app.status !== 'Pending' ? 'done' : ''}`}></div>
                                        <div className={`track-dot ${['Accepted', 'Rejected'].includes(app.status) ? (app.status === 'Rejected' ? 'error' : 'done') : ''}`}></div>
                                    </div>
                                    <span className={`status-small ${app.status.toLowerCase()}`}>{app.status}</span>
                                </div>
                            ))
                        ) : (
                            <p>No recent applications.</p>
                        )}
                    </div>
                    <Link to="/applied-jobs" className="btn-text">View all applications →</Link>
                </div>
            </div>

            <style>{`
        .dashboard-page { padding-top: 2rem; padding-bottom: 4rem; }
        .dashboard-header { padding: 3rem; margin-bottom: 3rem; background: rgba(255, 255, 255, 0.8) !important; }
        
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 3rem; }
        .stat-card { padding: 2.5rem; text-align: center; background: rgba(255, 255, 255, 0.8) !important; border-radius: 2rem; }
        .stat-number { font-size: 3rem; font-weight: 900; color: var(--primary); margin: 0.5rem 0; }
        .stat-label { color: var(--gray); font-size: 1rem; font-weight: 600; }
        .stat-link { color: var(--primary); font-size: 0.95rem; text-decoration: underline; font-weight: 600; }

        .recent-section { padding: 2.5rem; background: rgba(255, 255, 255, 0.8) !important; border-radius: 2rem; }
        .recent-list { margin: 1.5rem 0; }
        .recent-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid #f1f5f9; }
        .status-small { font-size: 0.75rem; padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 600; text-transform: uppercase; }
        .status-small.pending { background: #fef3c7; color: #92400e; }
        .status-small.accepted { background: #dcfce7; color: #166534; }
        
        .mini-track { display: flex; gap: 6px; margin-right: 1.5rem; }
        .track-dot { width: 8px; height: 8px; background: #e2e8f0; border-radius: 50%; opacity: 0.5; }
        .track-dot.active { background: var(--primary); opacity: 1; transform: scale(1.2); box-shadow: 0 0 5px var(--primary); }
        .track-dot.done { background: var(--primary); opacity: 1; }
        .track-dot.error { background: #ef4444; opacity: 1; }

        .btn-text { color: var(--primary); font-weight: 600; font-size: 0.9rem; }
      `}</style>
        </div>
    );
};

export default JobSeekerDashboard;
