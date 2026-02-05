import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminJobManagement = () => {
    const { user } = useContext(AuthContext);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5055/api/admin/jobs', config);
                setJobs(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching jobs');
                setLoading(false);
            }
        };
        fetchJobs();
    }, [user]);

    const handleStatusUpdate = async (id, status) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5055/api/admin/jobs/${id}`, { status }, config);
            setJobs(jobs.map(j => j._id === id ? { ...j, status } : j));
            alert(`Job status updated to ${status}`);
        } catch (err) {
            alert('Update failed');
        }
    };

    if (loading) return <div className="container">Loading Jobs...</div>;

    return (
        <div className="container admin-jobs-page">
            <div className="page-header glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1>Job Moderation</h1>
                    <p>Review and moderate all job postings system-wide</p>
                </div>
                <a
                    href="http://localhost:5055/api/admin/export/jobs"
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Export CSV
                </a>
            </div>

            <div className="table-container glass">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Company</th>
                            <th>Recruiter</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(j => (
                            <tr key={j._id}>
                                <td><strong>{j.title}</strong></td>
                                <td>{j.company}</td>
                                <td>{j.recruiter?.name}</td>
                                <td>
                                    <span className={`status-badge ${j.status.toLowerCase()}`}>{j.status}</span>
                                </td>
                                <td className="actions-cell">
                                    <button onClick={() => handleStatusUpdate(j._id, 'Open')} className="btn-small btn-success">Open</button>
                                    <button onClick={() => handleStatusUpdate(j._id, 'Closed')} className="btn-small btn-error">Close</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
        .admin-jobs-page { padding-top: 2rem; }
        .page-header { padding: 2rem; margin-bottom: 2rem; }
        .table-container { padding: 1rem; overflow-x: auto; }
        .admin-table { width: 100%; border-collapse: collapse; }
        .admin-table th, .admin-table td { padding: 1.25rem 1rem; text-align: left; border-bottom: 1px solid #f1f5f9; }
        
        .status-badge { padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .status-badge.open { background: #dcfce7; color: #166534; }
        .status-badge.closed { background: #fee2e2; color: #991b1b; }
        
        .actions-cell { display: flex; gap: 0.5rem; }
        .btn-small { padding: 0.4rem 0.8rem; border-radius: 4px; border: 1px solid #e2e8f0; cursor: pointer; font-size: 0.8rem; font-weight: 600; }
        .btn-success { background: var(--success); color: white; border: none; }
        .btn-error { background: var(--error); color: white; border: none; }
      `}</style>
        </div>
    );
};

export default AdminJobManagement;
