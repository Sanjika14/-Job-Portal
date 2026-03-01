import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const JobApplicants = () => {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchApplicants = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` },
                };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/recruiter/jobs/${id}/applicants`, config);
                setApplicants(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching applicants');
                setLoading(false);
            }
        };
        if (user) fetchApplicants();
    }, [id, user]);

    const handleStatusUpdate = async (appId, status) => {
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            await axios.put(`${import.meta.env.VITE_API_URL}/api/recruiter/applications/${appId}`, { status }, config);
            setApplicants(applicants.map(app => app._id === appId ? { ...app, status } : app));
            alert(`Application marked as ${status}`);
        } catch (err) {
            alert('Status update failed');
        }
    };

    if (loading) return <div className="container">Loading...</div>;

    return (
        <div className="container applicants-page">
            <div className="page-header glass">
                <h1 className="glitter-text">Job Applicants</h1>
                <p>Review and manage candidates for this position</p>
            </div>

            <div className="applicants-grid">
                {applicants.length > 0 ? (
                    applicants.map((app) => (
                        <div key={app._id} className="applicant-card glass">
                            <div className="applicant-info">
                                <h3>{app.applicant.name}</h3>
                                <p className="email">{app.applicant.email}</p>
                                <div className="bio">{app.applicant.profile?.bio || 'No bio provided'}</div>
                                <div className="skills">
                                    {app.applicant.profile?.skills?.map((skill, i) => (
                                        <span key={i} className="skill-tag">{skill}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="applicant-actions">
                                <a href={`${import.meta.env.VITE_API_URL}${app.resume}`} target="_blank" rel="noreferrer" className="btn btn-secondary">View Resume</a>
                                <div className="status-controls">
                                    <button onClick={() => handleStatusUpdate(app._id, 'Reviewed')} className="btn-small">Shortlist</button>
                                    <button onClick={() => handleStatusUpdate(app._id, 'Accepted')} className="btn-small btn-success">Accept</button>
                                    <button onClick={() => handleStatusUpdate(app._id, 'Rejected')} className="btn-small btn-error">Reject</button>
                                </div>
                                <p className="current-status">Status: <strong>{app.status}</strong></p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No applicants yet.</p>
                )}
            </div>

            <style>{`
                .applicants-page::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
                    background-size: cover;
                    z-index: -1;
                }
                .applicants-page { position: relative; z-index: 1; padding-top: 4rem; padding-bottom: 4rem; }
                .page-header { padding: 3rem; margin-bottom: 3rem; text-align: center; }
                .applicants-grid { display: grid; gap: 2rem; max-width: 1000px; margin: 0 auto; }
                .applicant-card { 
                    padding: 2.5rem; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    background: rgba(20, 20, 20, 0.6) !important;
                    border: 1px solid rgba(212, 175, 55, 0.1);
                    transition: transform 0.3s;
                }
                .applicant-card:hover { transform: translateY(-5px); border-color: var(--primary); }
                .applicant-info h3 { font-size: 1.8rem; margin-bottom: 0.5rem; color: #fff; }
                .email { color: var(--primary); font-weight: 600; margin-bottom: 1rem; font-size: 1.1rem; }
                .bio { color: var(--light); opacity: 0.8; margin-bottom: 1.5rem; font-size: 1rem; line-height: 1.6; }
                .skill-tag { 
                    display: inline-block; 
                    background: rgba(212, 175, 55, 0.1); 
                    color: var(--primary);
                    padding: 0.4rem 1rem; 
                    border-radius: 0.5rem; 
                    font-size: 0.85rem; 
                    font-weight: 700;
                    margin: 0 0.6rem 0.6rem 0; 
                    border: 1px solid rgba(212, 175, 55, 0.2);
                }
                
                .applicant-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 1.5rem; min-width: 200px; }
                .status-controls { display: flex; gap: 0.8rem; }
                .btn-small { 
                    padding: 0.6rem 1.2rem; 
                    font-size: 0.85rem; 
                    border-radius: 0.5rem; 
                    font-weight: 700; 
                    cursor: pointer; 
                    background: rgba(255,255,255,0.05);
                    color: #fff;
                    border: 1px solid rgba(255,255,255,0.2);
                    transition: all 0.3s;
                }
                .btn-small:hover { background: #fff; color: #000; }
                .btn-success { background: rgba(34, 197, 94, 0.1); color: #22c55e; border-color: rgba(34, 197, 94, 0.3); }
                .btn-success:hover { background: #22c55e; color: #fff; }
                .btn-error { background: rgba(239, 68, 68, 0.1); color: #ef4444; border-color: rgba(239, 68, 68, 0.3); }
                .btn-error:hover { background: #ef4444; color: #fff; }
                .current-status { font-size: 1rem; color: var(--light); opacity: 0.9; }
                .current-status strong { color: var(--primary); text-transform: uppercase; margin-left: 0.5rem; }
      `}</style>
        </div>
    );
};

export default JobApplicants;
