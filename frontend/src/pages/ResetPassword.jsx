import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) return alert('Passwords do not match');

        try {
            await axios.put(`${import.meta.env.VITE_API_URL}/api/auth/reset-password/${token}`, { password });
            alert('Password reset successful. Please login.');
            navigate('/login');
        } catch (err) {
            alert(err.response?.data?.message || 'Reset failed');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <h2>Reset Password</h2>
                <p>Enter your new password below.</p>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-primary w-full">Reset Password</button>
                </form>
            </div>

            <style>{`
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
        .auth-card { padding: 2.5rem; width: 100%; max-width: 400px; }
        .form-group { margin-bottom: 1.25rem; }
        label { display: block; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .w-full { width: 100%; }
      `}</style>
        </div>
    );
};

export default ResetPassword;
