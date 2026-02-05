import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import JobList from './pages/JobList';
import Home from './pages/Home';
import JobDetails from './pages/JobDetails';
import AppliedJobs from './pages/AppliedJobs';
import PostJob from './pages/PostJob';
import ManageJobs from './pages/ManageJobs';
import JobApplicants from './pages/JobApplicants';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import RecruiterDashboard from './pages/RecruiterDashboard';
import SavedJobs from './pages/SavedJobs';
import Notifications from './pages/Notifications';
import AdminDashboard from './pages/AdminDashboard';
import AdminUserManagement from './pages/AdminUserManagement';
import AdminJobManagement from './pages/AdminJobManagement';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import VerifyEmail from './pages/VerifyEmail';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  if (!user) return <Login />;
  return user.role === 'recruiter' ? <RecruiterDashboard /> : <JobSeekerDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobList />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/applications" element={<AppliedJobs />} />
            <Route path="/post-job" element={<PostJob />} />
            <Route path="/manage-jobs" element={<ManageJobs />} />
            <Route path="/job-applicants/:id" element={<JobApplicants />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/saved-jobs" element={<SavedJobs />} />
            <Route path="/notifications" element={<Notifications />} />

            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUserManagement />} />
            <Route path="/admin/jobs" element={<AdminJobManagement />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/verify/:token" element={<VerifyEmail />} />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
