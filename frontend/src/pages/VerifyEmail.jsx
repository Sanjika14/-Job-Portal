import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying');

    useEffect(() => {
        const verify = async () => {
            try {
                await axios.get(`http://localhost:5055/api/auth/verify/${token}`);
                setStatus('success');
            } catch (err) {
                setStatus('error');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="auth-container">
            <div className="auth-card glass">
                {status === 'verifying' && <h2>Verifying your email...</h2>}
                {status === 'success' && (
                    <>
                        <h2>Email Verified!</h2>
                        <p>You can now log in to your account.</p>
                        <Link to="/login" className="btn btn-primary">Login Now</Link>
                    </>
                )}
                {status === 'error' && (
                    <>
                        <h2>Verification Failed</h2>
                        <p>The link might be invalid or expired.</p>
                        <Link to="/register">Try Registering Again</Link>
                    </>
                )}
            </div>

            <style>{`
        .auth-container { display: flex; justify-content: center; align-items: center; min-height: 80vh; text-align: center; }
        .auth-card { padding: 3rem; width: 100%; max-width: 500px; }
        h2 { margin-bottom: 1rem; }
        p { margin-bottom: 2rem; color: var(--gray); }
      `}</style>
        </div>
    );
};

export default VerifyEmail;
