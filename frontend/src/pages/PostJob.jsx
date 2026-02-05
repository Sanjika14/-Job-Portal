import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PostJob = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        salary: '',
        jobType: 'Full-time',
        category: '',
        skillsRequired: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const data = {
                ...formData,
                requirements: formData.requirements.split('\n').filter(r => r.trim() !== ''),
                skillsRequired: formData.skillsRequired.split(',').map(s => s.trim()),
                salary: Number(formData.salary),
            };
            await axios.post('http://localhost:5055/api/recruiter/jobs', data, config);
            alert('Job posted successfully!');
            navigate('/manage-jobs');
        } catch (err) {
            alert('Failed to post job');
        }
    };

    return (
        <div className="container post-job-page">
            <div className="page-header glass">
                <h1>Post a New Job</h1>
                <p>Fill in the details to find the best candidates</p>
            </div>

            <form onSubmit={handleSubmit} className="post-job-form glass">
                <div className="form-grid">
                    <div className="form-group">
                        <label>Job Title</label>
                        <input required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. Senior Frontend Developer" />
                    </div>
                    <div className="form-group">
                        <label>Company Name</label>
                        <input required value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} placeholder="e.g. Tech Corp" />
                    </div>
                    <div className="form-group">
                        <label>Location</label>
                        <input required value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="e.g. Remote or City, Country" />
                    </div>
                    <div className="form-group">
                        <label>Salary (Annual USD)</label>
                        <input type="number" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} placeholder="e.g. 120000" />
                    </div>
                    <div className="form-group">
                        <label>Job Type</label>
                        <select value={formData.jobType} onChange={(e) => setFormData({ ...formData, jobType: e.target.value })}>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                            <option value="Internship">Internship</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Category</label>
                        <input required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} placeholder="e.g. Engineering" />
                    </div>
                </div>

                <div className="form-group full-width">
                    <label>Skills Required (comma separated)</label>
                    <input required value={formData.skillsRequired} onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })} placeholder="React, Node.js, TypeScript" />
                </div>

                <div className="form-group full-width">
                    <label>Job Description</label>
                    <textarea required value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows="5"></textarea>
                </div>

                <div className="form-group full-width">
                    <label>Requirements (one per line)</label>
                    <textarea required value={formData.requirements} onChange={(e) => setFormData({ ...formData, requirements: e.target.value })} rows="5"></textarea>
                </div>

                <button type="submit" className="btn btn-primary">Post Job Opening</button>
            </form>

            <style>{`
                .post-job-page::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
                    background-size: cover;
                    z-index: -1;
                }
                .post-job-page { position: relative; z-index: 1; padding-top: 4rem; padding-bottom: 4rem; }
                .page-header { padding: 3rem; margin-bottom: 3rem; text-align: center; }
                .post-job-form { padding: 3rem; background: rgba(20, 20, 20, 0.6) !important; border: 1px solid rgba(212, 175, 55, 0.1); }
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; margin-bottom: 2rem; }
                .form-group { margin-bottom: 1.5rem; }
                .full-width { grid-column: span 2; }
                label { display: block; margin-bottom: 0.6rem; font-weight: 600; color: var(--light); opacity: 0.9; }
                input, select, textarea { 
                    width: 100%; 
                    padding: 0.8rem 1.2rem; 
                    background: rgba(10, 10, 10, 0.4); 
                    border: 1px solid rgba(212, 175, 55, 0.2); 
                    border-radius: 0.6rem; 
                    color: #fff; 
                    font-size: 1rem;
                    transition: all 0.3s;
                }
                input:focus, select:focus, textarea:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(10, 10, 10, 0.6);
                }
      `}</style>
        </div>
    );
};

export default PostJob;
