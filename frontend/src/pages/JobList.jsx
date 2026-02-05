import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const JobList = () => {
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '',
        location: '',
        sort: 'latest',
    });

    const fetchJobs = async () => {
        try {
            const { data } = await axios.get('http://localhost:5055/api/jobs', { params: filters });
            setJobs(data);
        } catch (err) {
            console.error('Error fetching jobs');
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs();
    };

    const locations = [...new Set(jobs.map((job) => job.location))].sort();

    return (
        <div className="container job-list-page">
            <style>{`
                .job-list-page::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
                    background-size: cover;
                    z-index: -1;
                }
                .job-list-page { position: relative; z-index: 1; padding-top: 4rem; }
                .search-bar { padding: 2rem; margin-bottom: 3rem; background: rgba(20, 20, 20, 0.6) !important; border: 1px solid rgba(212, 175, 55, 0.2); }
                .search-form { display: grid; grid-template-columns: 1fr 1fr 150px auto; gap: 1.5rem; }
                .search-form input, .search-form select { 
                    padding: 0.8rem 1.2rem; 
                    background: rgba(10, 10, 10, 0.4); 
                    border: 1px solid rgba(212, 175, 55, 0.2); 
                    border-radius: 0.6rem; 
                    color: #fff; 
                    font-weight: 500; 
                    transition: all 0.3s;
                }
                .search-form input:focus, .search-form select:focus {
                    outline: none;
                    border-color: var(--primary);
                    background: rgba(10, 10, 10, 0.6);
                }
                
                .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 2rem; }
                .job-card { 
                    padding: 2rem; 
                    background: rgba(20, 20, 20, 0.5) !important;
                    border: 1px solid rgba(212, 175, 55, 0.1);
                    transition: all 0.3s ease;
                }
                .job-card:hover { 
                    transform: translateY(-8px); 
                    border-color: rgba(212, 175, 55, 0.4);
                    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
                }
                .job-card h3 { color: #fff; margin-bottom: 0.5rem; }
                .job-type { background: rgba(212, 175, 55, 0.1); color: var(--primary); border: 1px solid rgba(212, 175, 55, 0.2); }
                .salary { color: #fff; font-size: 1.1rem; }
                .btn-secondary { border: 1px solid var(--primary); color: var(--primary); transition: all 0.3s; }
                .btn-secondary:hover { background: var(--gold-gradient); color: var(--dark); border-color: transparent; }
            `}</style>
            <div className="search-bar glass">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Job title or keyword"
                        value={filters.keyword}
                        onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                    />
                    <select
                        value={filters.location}
                        onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                    >
                        <option value="">All Locations</option>
                        <option value="Remote">Remote</option>
                        {locations.filter(loc => loc !== 'Remote').map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </select>
                    <select
                        value={filters.sort}
                        onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                    >
                        <option value="latest">Latest</option>
                        <option value="salary">Salary (High to Low)</option>
                    </select>
                    <button type="submit" className="btn btn-primary">Search Jobs</button>
                </form>
            </div>

            <div className="jobs-grid">
                {jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job._id} className="job-card glass">
                            <div className="job-card-header">
                                <h3>{job.title}</h3>
                                <span className="job-type">{job.jobType}</span>
                            </div>
                            <p className="company-name">{job.company}</p>
                            <p className="location">{job.location}</p>
                            <div className="job-footer">
                                <span className="salary">{job.salary ? `$${job.salary.toLocaleString()}` : 'Negotiable'}</span>
                                <Link to={`/jobs/${job._id}`} className="btn btn-secondary">Apply Now</Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No jobs found.</p>
                )}
            </div>

            <style>{`
        .job-list-page { padding-top: 2rem; }
        .search-bar { padding: 1.5rem; margin-bottom: 2rem; }
        .search-form { display: grid; grid-template-columns: 1fr 1fr 150px auto; gap: 1rem; }
        .search-form input, .search-form select { padding: 0.75rem; border: 1px solid rgba(255, 255, 255, 0.3); border-radius: 0.5rem; background: rgba(255, 255, 255, 0.4); color: var(--dark); font-weight: 500; }
        .search-form input::placeholder { color: var(--gray); opacity: 0.8; }
        
        .jobs-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1.5rem; }
        .job-card { padding: 1.5rem; display: flex; flex-direction: column; transition: transform 0.2s; }
        .job-card:hover { transform: translateY(-5px); }
        .job-card-header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem; }
        .job-type { font-size: 0.75rem; background: rgba(0, 121, 107, 0.1); color: #00796b; padding: 0.25rem 0.5rem; border-radius: 4px; font-weight: 600; border: 1px solid rgba(0, 121, 107, 0.2); }
        .company-name { font-weight: 600; color: var(--primary); margin-bottom: 0.25rem; }
        .location { color: var(--gray); font-size: 0.9rem; margin-bottom: 1rem; }
        .job-footer { margin-top: auto; display: flex; justify-content: space-between; align-items: center; }
        .salary { font-weight: 700; color: var(--dark); }
        .btn-secondary { background: none; border: 1px solid var(--primary); color: var(--primary); font-size: 0.9rem; padding: 0.5rem 1rem; }
      `}</style>
        </div>
    );
};

export default JobList;
