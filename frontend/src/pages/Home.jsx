import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="home-page">
      <div className="home-bg-overlay"></div>
      <section className="hero-section glass">
        <div className="hero-content">
          <h1 className="hero-title wave-text">
            Find Your Dream Career Today
          </h1>
          <p className="hero-subtitle">
            Connecting millions of top-tier professionals with high-end opportunities worldwide.
          </p>
          <div className="hero-actions">
            {!user ? (
              <>
                <Link to="/login" className="btn btn-primary btn-lg shimmer">Login to Apply</Link>
                <Link to="/register" className="btn btn-outline btn-lg">Join as Job Seeker</Link>
              </>
            ) : (
              <Link to="/browse-jobs" className="btn btn-primary btn-lg shimmer">Browse All Jobs</Link>
            )}
          </div>
        </div>
      </section>

      <div className="home-secondary-bg">
        <section className="stats-section">
          <div className="stat-card glass">
            <h3>500+</h3>
            <p>Companies</p>
          </div>
          <div className="stat-card glass">
            <h3>10k+</h3>
            <p>Active Jobs</p>
          </div>
          <div className="stat-card glass">
            <h3>5k+</h3>
            <p>Success Stories</p>
          </div>
        </section>

        <section className="features-grid">
          <div className="feature-card glass">
            <div className="feature-icon">🚀</div>
            <h4>Quick Apply</h4>
            <p>Apply to your dream jobs with just a single click using your saved profile.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon">📊</div>
            <h4>Track Progress</h4>
            <p>Monitor your application status in real-time through your personal dashboard.</p>
          </div>
          <div className="feature-card glass">
            <div className="feature-icon">🛡️</div>
            <h4>Verified Roles</h4>
            <p>Every job listing is manually reviewed by our admin team for your safety.</p>
          </div>
        </section>
      </div>

      <style>{`
        .home-page {
          position: relative;
          min-height: 100vh;
          padding-top: 4rem;
          display: flex;
          flex-direction: column;
          gap: 6rem;
          padding-bottom: 6rem;
          z-index: 1;
        }

        .home-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
          background-size: cover;
          z-index: -2;
        }

        .hero-section {
          padding: 8rem 2rem;
          text-align: center;
          border-radius: 3rem;
          max-width: 1100px;
          margin: 0 auto;
          position: relative;
          overflow: hidden;
          background: rgba(20, 20, 20, 0.4);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .hero-title {
          font-size: 5rem;
          font-weight: 900;
          line-height: 1;
          margin-bottom: 2rem;
          color: #fff;
          letter-spacing: -2px;
        }

        .text-gradient {
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-subtitle {
          font-size: 1.5rem;
          color: var(--light);
          opacity: 0.8;
          max-width: 700px;
          margin: 0 auto 3.5rem;
          line-height: 1.5;
          font-weight: 500;
        }

        .hero-actions {
          display: flex;
          gap: 2rem;
          justify-content: center;
        }

        .btn-lg {
          padding: 1.25rem 3.5rem;
          font-size: 1.2rem;
          font-weight: 700;
          border-radius: 1rem;
        }

        .btn-outline {
          border: 2px solid var(--primary);
          color: var(--primary);
          transition: all 0.3s;
          background: transparent;
        }

        .btn-outline:hover {
          background: var(--gold-gradient);
          color: var(--dark);
          transform: translateY(-2px);
          border-color: transparent;
        }

        .home-secondary-bg {
          display: flex;
          flex-direction: column;
          gap: 6rem;
          padding: 4rem 2rem;
          border-radius: 4rem;
          background: rgba(15, 15, 15, 0.4);
          backdrop-filter: blur(25px);
          border: 1px solid rgba(212, 175, 55, 0.1);
        }

        .stats-section {
          display: flex;
          justify-content: center;
          gap: 3rem;
          flex-wrap: wrap;
        }

        .stat-card {
          padding: 3rem 2rem;
          text-align: center;
          width: 250px;
          border-radius: 2rem;
          transition: all 0.3s;
        }

        .stat-card:hover { 
          background: rgba(212, 175, 55, 0.05); 
          transform: translateY(-5px); 
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .stat-card h3 {
          font-size: 3.5rem;
          background: var(--gold-gradient);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
          font-weight: 900;
        }
        
        .stat-card p { font-weight: 600; color: var(--light); opacity: 0.7; }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
          gap: 3rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .feature-card {
          padding: 3.5rem 2.5rem;
          text-align: center;
          border-radius: 3rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          border: 1px solid rgba(212, 175, 55, 0.1);
          background: rgba(20, 20, 20, 0.3);
        }

        .feature-card:hover {
          transform: translateY(-15px);
          background: rgba(212, 175, 55, 0.03);
          border-color: rgba(212, 175, 55, 0.4);
          box-shadow: 0 30px 60px -15px rgba(0,0,0,0.5);
        }

        .feature-icon {
          font-size: 4rem;
          margin-bottom: 2rem;
          display: inline-block;
          filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.3));
        }

        .feature-card h4 {
          font-size: 1.75rem;
          margin-bottom: 1.5rem;
          color: #fff;
          font-weight: 800;
        }

        .feature-card p {
          color: var(--light);
          opacity: 0.7;
          line-height: 1.8;
          font-size: 1.1rem;
        }
      `}</style>

    </div>
  );
};

export default Home;
