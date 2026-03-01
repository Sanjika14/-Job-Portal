import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AppliedJobs = () => {
    const { user } = useContext(AuthContext);
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/applications/my`, config);
                setApplications(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching applications');
                setLoading(false);
            }
        };
        if (user) fetchApplications();
    }, [user]);

    const handleWithdraw = async (id) => {
        if (!window.confirm('Are you sure you want to withdraw this application?')) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/applications/${id}`, config);
            setApplications(applications.filter(app => app._id !== id));
            alert('Application withdrawn');
        } catch (err) {
            alert('Withdraw failed');
        }
    };

    const getStatusStep = (status) => {
        switch (status) {
            case 'Pending': return 1;
            case 'Reviewed': return 2;
            case 'Accepted':
            case 'Rejected': return 3;
            default: return 1;
        }
    };

    if (loading) return <div className="container">Loading Your Applications...</div>;

    return (
        <div className="container applied-jobs-page">
            <style>{`
                .applied-jobs-page::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
                    background-size: cover;
                    z-index: -1;
                }
                .applied-jobs-page { position: relative; z-index: 1; padding-top: 4rem; padding-bottom: 4rem; }
                .page-header { background: rgba(20, 20, 20, 0.5) !important; border: 1px solid rgba(212, 175, 55, 0.2); padding: 3rem; margin-bottom: 4rem; }
                .page-header h1 { color: #fff; font-size: 3rem; }
                .page-header p { color: var(--light); opacity: 0.8; }

                .application-card { 
                    background: rgba(20, 20, 20, 0.6) !important; 
                    border: 1px solid rgba(212, 175, 55, 0.1);
                    padding: 2.5rem;
                }
                .job-title { color: #fff; }
                .progress-line { background: rgba(255, 255, 255, 0.1); }
                .dot { background: rgba(255, 255, 255, 0.2); }
                .label { color: rgba(255, 255, 255, 0.5); }
                .btn-withdraw { background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.2); transition: all 0.3s; }
                .btn-withdraw:hover { background: #ef4444; color: #fff; }
            `}</style>
            <div className="page-header glass">
                <h1>My Applications</h1>
                <p>View and manage all your submitted job applications in one place.</p>
            </div>

            <div className="applications-list">
                {applications.length > 0 ? (
                    applications.map((app) => (
                        <div key={app._id} className="application-card glass">
                            <div className="app-main-info">
                                <div>
                                    <h3 className="job-title">{app.job.title}</h3>
                                    <p className="company-info">{app.job.company} • {app.job.location}</p>
                                    <p className="applied-date">Applied on {new Date(app.appliedAt).toLocaleDateString()}</p>
                                </div>
                                <div className="app-actions">
                                    <button onClick={() => handleWithdraw(app._id)} className="btn-withdraw">Withdraw Application</button>
                                </div>
                            </div>

                            <div className="tracking-viz">
                                <div className="progress-line">
                                    <div className={`progress-segment s1 ${getStatusStep(app.status) >= 1 ? 'active' : ''}`}></div>
                                    <div className={`progress-segment s2 ${getStatusStep(app.status) >= 2 ? 'active' : ''}`}></div>
                                    <div className={`progress-segment s3 ${getStatusStep(app.status) >= 3 ? 'active' : ''} ${app.status === 'Rejected' ? 'rejected' : ''}`}></div>
                                </div>
                                <div className="progress-labels">
                                    <div className={`label ${getStatusStep(app.status) >= 1 ? 'active' : ''}`}>
                                        <span className="dot"></span>
                                        Applied
                                    </div>
                                    <div className={`label ${getStatusStep(app.status) >= 2 ? 'active' : ''}`}>
                                        <span className="dot"></span>
                                        Reviewed
                                    </div>
                                    <div className={`label ${getStatusStep(app.status) >= 3 ? 'active' : ''} ${app.status === 'Rejected' ? 'rejected' : ''}`}>
                                        <span className="dot"></span>
                                        {app.status === 'Rejected' ? 'Rejected' : app.status === 'Accepted' ? 'Accepted' : 'Final Decision'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data glass">
                        <h3 style={{ color: '#fff' }}>No applications tracked yet.</h3>
                        <p style={{ color: 'var(--light)', opacity: 0.7 }}>Start your journey by applying to some jobs!</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AppliedJobs;
