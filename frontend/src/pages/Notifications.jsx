import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Notifications = () => {
    const { user } = useContext(AuthContext);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user.token}` } };
                const { data } = await axios.get('http://localhost:5055/api/notifications', config);
                setNotifications(data);
            } catch (err) {
                console.error('Error fetching notifications');
            }
        };
        if (user) fetchNotifications();
    }, [user]);

    const handleRead = async (id) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            await axios.put(`http://localhost:5055/api/notifications/${id}`, {}, config);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Error marking as read');
        }
    };

    return (
        <div className="container notifications-page">
            <style>{`
                .notifications-page::before {
                    content: '';
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80') no-repeat center center fixed;
                    background-size: cover;
                    z-index: -1;
                }
                .notifications-page { position: relative; z-index: 1; padding-top: 4rem; padding-bottom: 6rem; }
                .page-header { background: rgba(20, 20, 20, 0.6) !important; border: 1px solid rgba(212, 175, 55, 0.2); padding: 3rem; margin-bottom: 4rem; text-align: center; }
                .page-header h1 { color: #fff; font-size: 3rem; margin-bottom: 0.5rem; }
                .page-header p { color: var(--light); opacity: 0.8; }

                .notifications-list { max-width: 900px; margin: 0 auto; display: flex; flex-direction: column; gap: 1.5rem; }
                .notification-item { 
                    padding: 2rem; 
                    background: rgba(20, 20, 20, 0.5) !important; 
                    border: 1px solid rgba(212, 175, 55, 0.1); 
                    border-left: 5px solid var(--primary);
                    transition: all 0.3s;
                }
                .notification-item:hover { transform: translateX(10px); border-left-width: 8px; }
                .notification-item.read { opacity: 0.6; border-left-color: rgba(255,255,255,0.2); }
                .message { color: #fff; font-size: 1.1rem; }
                .time { color: var(--light); opacity: 0.5; }
                .btn-link { color: var(--primary); font-weight: 700; text-transform: uppercase; font-size: 0.9rem; }
                .btn-read { color: var(--success); font-weight: 700; border: 1px solid rgba(34, 197, 94, 0.3); padding: 0.4rem 1rem; border-radius: 0.5rem; transition: all 0.3s; }
                .btn-read:hover { background: var(--success); color: #fff; }
            `}</style>
            <div className="page-header glass">
                <h1 className="glitter-text">Notifications</h1>
                <p>Stay updated with your latest activities</p>
            </div>

            <div className="notifications-list">
                {Array.isArray(notifications) && notifications.length > 0 ? (
                    notifications.map(n => (
                        <div key={n._id} className={`notification-item glass ${n.isRead ? 'read' : 'unread'}`}>
                            <div className="notification-content">
                                <p className="message">{n.message}</p>
                                <span className="time">{new Date(n.createdAt).toLocaleString()}</span>
                            </div>
                            <div className="notification-actions">
                                {n.link && <Link to={n.link} className="btn-link">View</Link>}
                                {!n.isRead && <button onClick={() => handleRead(n._id)} className="btn-read">Mark as Read</button>}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-data glass" style={{ padding: '3rem', textAlign: 'center' }}>
                        <h3 style={{ color: '#fff', marginBottom: '1rem' }}>No notifications yet</h3>
                        <p style={{ color: 'var(--light)', opacity: 0.8 }}>We'll notify you here when something important happens.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
