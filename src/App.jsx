import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean(localStorage.getItem('jwtToken')));

  useEffect(() => {
    const onAuth = () => setIsAuthenticated(Boolean(localStorage.getItem('jwtToken')));
    window.addEventListener('authChanged', onAuth);
    window.addEventListener('storage', onAuth);
    return () => {
      window.removeEventListener('authChanged', onAuth);
      window.removeEventListener('storage', onAuth);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    // also remove fallback token key if present
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/');
  };
  const navbarStyle = {
    background: 'linear-gradient(135deg, #183de6ff 0%, #712db6ff 100%)',
    padding: '1rem 2rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
  };

  const navLinkStyle = {
    color: '#fafafaff',
    marginRight: '2rem',
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: '500',
    cursor: 'pointer',
  };

  const centerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 60px)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif',
  };

  const headingStyle = {
    color: '#fff',
    fontSize: '3rem',
    fontWeight: 'bold',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
    letterSpacing: '2px',
  };

  return (
    <>
      <nav style={navbarStyle}>
        <Link to="/test" style={navLinkStyle}>Test Conn </Link>
        <Link to="/" style={navLinkStyle}>Home</Link>
        {!isAuthenticated ? (
          <>
            <Link to="/login" style={navLinkStyle}>Login</Link>
            <Link to="/register" style={navLinkStyle}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={navLinkStyle}>Dashboard</Link>
            <button onClick={handleLogout} style={{ ...navLinkStyle, background: 'transparent', border: 'none', padding: 0 }}>Logout</button>
          </>
        )}
      </nav>
      <Routes>
        <Route path="/" element={
          <div style={centerStyle}>
            <h1 style={headingStyle}>Frontend For Intern task</h1>
          </div>
        } />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
      </Routes>
    </>
  );
}

export default App;
