import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('jwtToken');
    setToken(t);
    if (!t) navigate('/login');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome — you are logged in.</p>
      <div style={{ wordBreak: 'break-all', marginTop: '1rem' }}>
        <strong>JWT Token:</strong>
        <div style={{ marginTop: '0.5rem', background: '#f4f4f4', padding: '1rem', borderRadius: 6 }}>
          {token || 'No token found'}
        </div>
      </div>
      <button onClick={handleLogout} style={{ marginTop: 20, padding: '0.5rem 1rem' }}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
