import React, { useEffect, useState } from "react";
import axios from "axios";

function Jobs() {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/jobs`)
            .then((response) => {
                setJobs(response.data);
            })
            .catch((error) => {
                console.error("Error fetching jobs:", error);
            });
    }, []);

    return (
        <div style={{ padding: '2rem', color: '#fff', background: 'rgba(0,0,0,0.8)', minHeight: '100vh' }}>
            <h2>Available Jobs</h2>
            <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
                {jobs.map((job) => (
                    <div key={job._id} style={{ padding: '1rem', border: '1px solid #d4af37', borderRadius: '8px', background: 'rgba(255,255,255,0.1)' }}>
                        <h3>{job.title}</h3>
                        <p><strong>Company:</strong> {job.company}</p>
                        <p><strong>Location:</strong> {job.location}</p>
                    </div>
                ))}
            </div>
            {jobs.length === 0 && <p>No jobs available at the moment.</p>}
        </div>
    );
}

export default Jobs;
