import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container nav-content">
        <Link to="/" className="logo">
          <span className="glitter-text">JobPortal</span>
        </Link>

        <div className="nav-links">
          <Link to="/jobs">Find Jobs</Link>
          {user ? (
            <>
              {user.role === 'recruiter' ? (
                <>
                  <Link to="/manage-jobs">Manage Jobs</Link>
                  <Link to="/post-job">Post Job</Link>
                </>
              ) : (
                <>
                  <Link to="/applications">My Applications</Link>
                  <Link to="/notifications">Alerts</Link>
                </>
              )}
              <Link to="/profile" className="profile-link">Profile</Link>
              <button onClick={handleLogout} className="btn-logout">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-login">Login</Link>
              <Link to="/register" className="btn btn-primary shimmer">Get Started</Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(10, 10, 10, 0.7);
          backdrop-filter: blur(25px);
          -webkit-backdrop-filter: blur(25px);
          padding: 1.25rem 0;
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .logo {
          font-size: 1.7rem;
          font-weight: 900;
          color: #fff;
          letter-spacing: -1px;
        }
        .logo span { 
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .nav-links {
          display: flex;
          gap: 2.2rem;
          align-items: center;
        }
        .nav-links a {
          font-weight: 600;
          color: var(--light);
          opacity: 0.8;
          transition: all 0.3s ease;
          letter-spacing: 0.3px;
          font-size: 0.95rem;
        }
        .nav-links a:hover { 
          opacity: 1;
          color: var(--primary);
          transform: translateY(-1px);
        }
        .user-name {
          font-weight: 700;
          color: var(--primary);
          background: rgba(212, 175, 55, 0.1);
          padding: 0.5rem 1.2rem;
          border-radius: 99px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          font-size: 0.9rem;
        }
        .btn-logout {
          background: none;
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--error);
          font-weight: 700;
          padding: 0.4rem 1rem;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 0.9rem;
        }
        .btn-logout:hover {
          background: var(--error);
          color: #fff;
        }
      `}</style>

    </nav>
  );
};

export default Navbar;
