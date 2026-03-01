import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const AdminUserManagement = () => {
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/users`, config);
                setUsers(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching users');
                setLoading(false);
            }
        };
        fetchUsers();
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, config);
            setUsers(users.filter(u => u._id !== id));
            alert('User removed');
        } catch (err) {
            alert(err.response?.data?.message || 'Delete failed');
        }
    };

    if (loading) return <div className="container">Loading Users...</div>;

    return (
        <div className="container admin-users-page">
            <div className="page-header glass">
                <h1>User Management</h1>
                <p>Review and moderate all registered users</p>
            </div>

            <div className="users-table-container glass">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Joined At</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td><strong>{u.name}</strong></td>
                                <td>{u.email}</td>
                                <td><span className={`role-badge ${u.role}`}>{u.role}</span></td>
                                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                <td>
                                    {u.role !== 'admin' && (
                                        <button onClick={() => handleDelete(u._id)} className="btn-delete">Delete</button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <style>{`
        .admin-users-page { padding-top: 2rem; }
        .page-header { padding: 2rem; margin-bottom: 2rem; }
        .users-table-container { padding: 1rem; overflow-x: auto; }
        .users-table { width: 100%; border-collapse: collapse; }
        .users-table th, .users-table td { padding: 1.25rem 1rem; text-align: left; border-bottom: 1px solid #f1f5f9; }
        
        .role-badge { padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; }
        .role-badge.jobseeker { background: #e0f2fe; color: #0369a1; }
        .role-badge.recruiter { background: #fef3c7; color: #92400e; }
        .role-badge.admin { background: #fee2e2; color: #b91c1c; }
        
        .btn-delete { color: var(--error); background: none; border: none; font-weight: 600; cursor: pointer; }
      `}</style>
        </div>
    );
};

export default AdminUserManagement;
