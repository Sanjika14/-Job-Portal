import { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5055/api/auth/forgot-password', { email });
            setMessage('A reset link has been sent to your email (check server console in this demo).');
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send reset link');
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                <h2>Forgot Password?</h2>
                <p>Enter your email and we'll send you a link to reset your password.</p>
                {message ? (
                    <div className="success-message">{message}</div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email Address</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-primary w-full">Send Reset Link</button>
                    </form>
                )}
                <p className="auth-footer">
                    Back to <Link to="/login">Login</Link>
                </p>
            </div>

            <style>{`
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; }
        .auth-card { padding: 2.5rem; width: 100%; max-width: 400px; }
        .success-message { background: #dcfce7; color: #166534; padding: 1rem; border-radius: 0.5rem; margin-bottom: 1rem; }
        .form-group { margin-bottom: 1.25rem; }
        label { display: block; margin-bottom: 0.5rem; }
        input { width: 100%; padding: 0.75rem; border-radius: 0.5rem; border: 1px solid #e2e8f0; }
        .w-full { width: 100%; }
        .auth-footer { margin-top: 1.5rem; text-align: center; }
      `}</style>
        </div>
    );
};

export default ForgotPassword;
