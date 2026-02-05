import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user, updateUser } = useContext(AuthContext);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        bio: '',
        skills: '',
        experience: [],
        education: [],
    });
    const [resume, setResume] = useState(null);

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name,
                email: user.email,
                bio: user.profile?.bio || '',
                skills: user.profile?.skills?.join(', ') || '',
                experience: user.profile?.experience || [],
                education: user.profile?.education || [],
            });
        }
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const data = {
                ...profileData,
                skills: profileData.skills.split(',').map(s => s.trim()),
            };
            const { data: updatedData } = await axios.put('http://localhost:5055/api/auth/profile', data, config);
            updateUser({ ...user, ...updatedData });
            alert('Profile updated successfully');

        } catch (err) {
            console.error('Update error:', err);
            alert(`Update failed: ${err.response?.data?.message || err.message}`);
        }
    };

    const handleResumeUpload = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('resume', resume);
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data: uploadData } = await axios.post('http://localhost:5055/api/auth/resume', formData, config);

            // Update global user state with new resume path
            const updatedUser = { ...user };
            if (!updatedUser.profile) updatedUser.profile = {};
            updatedUser.profile.resume = uploadData.resume;
            updateUser(updatedUser);

            alert('Resume uploaded');


        } catch (err) {
            console.error('Upload error:', err);
            const serverMessage = err.response?.data?.message || err.message;
            const serverStack = err.response?.data?.stack || '';
            alert(`Upload failed: ${serverMessage}\n\nStack: ${serverStack}`);
        }


    };

    if (!user) return <div className="container">Please login.</div>;

    return (
        <div className="container profile-page">
            <div className="profile-header glass">
                <h1>My Profile</h1>
                <p>Manage your account and professional details</p>
            </div>

            <div className="profile-grid">
                <section className="glass profile-section">
                    <h3>Personal Info</h3>
                    <form onSubmit={handleUpdate}>
                        <div className="form-group">
                            <label>Name</label>
                            <input value={profileData.name} onChange={(e) => setProfileData({ ...profileData, name: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Bio</label>
                            <textarea value={profileData.bio} onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label>Skills (comma separated)</label>
                            <input value={profileData.skills} onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })} />
                        </div>
                        <button className="btn btn-primary">Save Changes</button>
                    </form>
                </section>

                {user.role === 'jobseeker' && (
                    <section className="glass profile-section">
                        <h3>Resume Management</h3>
                        <form onSubmit={handleResumeUpload}>
                            <div className="form-group">
                                <label>Upload Resume (PDF)</label>
                                <input type="file" accept=".pdf" onChange={(e) => setResume(e.target.files[0])} />
                            </div>
                            <button className="btn btn-primary">Upload PDF</button>
                        </form>
                        {user.profile?.resume && (
                            <div style={{ marginTop: '1rem' }}>
                                <a href={`http://localhost:5055${user.profile.resume}`} target="_blank" rel="noreferrer" className="btn btn-secondary">View Current Resume</a>
                            </div>
                        )}
                    </section>
                )}
            </div>

            <style>{`
                .profile-page::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
                    background-size: cover;
                    z-index: -1;
                }
                .profile-page { position: relative; z-index: 1; padding-top: 4rem; padding-bottom: 4rem; }
        .profile-header { 
            padding: 3rem; 
            margin-bottom: 3rem; 
            text-align: center;
        }
        .profile-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2.5rem; }
        .profile-section { padding: 2.5rem; }
        .profile-section h3 { margin-bottom: 2rem; color: var(--primary); font-size: 1.5rem; }
        
        .form-group { margin-bottom: 1.8rem; }
        .form-group label { 
            display: block; 
            margin-bottom: 0.6rem; 
            font-weight: 600; 
            color: var(--light);
            opacity: 0.9;
        }
        input, textarea {
            width: 100%;
            padding: 0.8rem 1.2rem;
            background: rgba(10, 10, 10, 0.4);
            border: 1px solid rgba(212, 175, 55, 0.2);
            border-radius: 0.6rem;
            color: #fff;
            transition: all 0.3s;
            font-family: inherit;
        }
        input:focus, textarea:focus {
            outline: none;
            border-color: var(--primary);
            background: rgba(10, 10, 10, 0.6);
            box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1);
        }
        textarea { height: 120px; resize: none; }
        
        @media (max-width: 768px) {
            .profile-grid { grid-template-columns: 1fr; }
        }
      `}</style>

        </div>
    );
};

export default Profile;
