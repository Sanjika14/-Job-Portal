import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { user } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/analytics`, config);
                setData(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching admin data');
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, [user]);

    if (loading) return <div className="container">Loading Admin Panel...</div>;

    return (
        <div className="container admin-dashboard">
            <div className="admin-header glass">
                <h1>Admin Control Center</h1>
                <p>System-wide monitoring and management</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card glass">
                    <h3>Total Users</h3>
                    <p className="stat-number">{data.totalUsers}</p>
                    <div className="breakdown">
                        <span>{data.userBreakdown.seekerCount} Seekers</span>
                        <span>{data.userBreakdown.recruiterCount} Employers</span>
                    </div>
                </div>
                <div className="stat-card glass">
                    <h3>Active Jobs</h3>
                    <p className="stat-number">{data.totalJobs}</p>
                    <Link to="/admin/jobs" className="stat-link">Manage Jobs</Link>
                </div>
                <div className="stat-card glass">
                    <h3>Applications</h3>
                    <p className="stat-number">{data.totalApplications}</p>
                    <span className="stat-label">System wide</span>
                </div>
            </div>

            <div className="admin-actions">
                <Link to="/admin/users" className="action-card glass">
                    <div className="icon">👥</div>
                    <h3>User Management</h3>
                    <p>Delete or deactivate accounts</p>
                </Link>
                <Link to="/admin/jobs" className="action-card glass">
                    <div className="icon">💼</div>
                    <h3>Job Moderation</h3>
                    <p>Approve or remove postings</p>
                </Link>
                <div className="action-card glass">
                    <div className="icon">⚙️</div>
                    <h3>System Settings</h3>
                    <p>Site configuration</p>
                </div>
            </div>

            <style>{`
        .admin-dashboard { padding-top: 2rem; padding-bottom: 4rem; }
        .admin-header { padding: 3rem; margin-bottom: 3rem; border-left: 8px solid var(--primary); background: rgba(255, 255, 255, 0.8) !important; border-radius: 2rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; margin-bottom: 4rem; }
        .stat-card { padding: 2.5rem; text-align: center; background: rgba(255, 255, 255, 0.8) !important; border-radius: 2rem; }
        .stat-number { font-size: 3.5rem; font-weight: 900; color: var(--primary); margin: 0.5rem 0; }
        .breakdown { display: flex; justify-content: center; gap: 1rem; font-size: 0.95rem; color: var(--gray); font-weight: 600; }
        
        .admin-actions { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
        .action-card { padding: 3rem 2.5rem; text-align: center; transition: all 0.4s ease; cursor: pointer; background: rgba(255, 255, 255, 0.8) !important; border-radius: 2.5rem; }
        .action-card:hover { transform: translateY(-10px); background: white !important; box-shadow: 0 20px 40px rgba(0,0,0,0.05); }
        .action-card .icon { font-size: 3rem; margin-bottom: 1.5rem; }
        .action-card h3 { margin-bottom: 0.75rem; font-weight: 800; }
        .action-card p { color: var(--gray); font-size: 1rem; font-weight: 500; }
      `}</style>
        </div>
    );
};

export default AdminDashboard;
