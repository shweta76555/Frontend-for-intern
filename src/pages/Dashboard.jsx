import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const t = localStorage.getItem('jwtToken');
    if (!t) {
      navigate('/login');
      return;
    }
    setToken(t);
    // Try to decode JWT payload
    try {
      const parts = t.split('.');
      if (parts.length >= 2) {
        const payload = parts[1];
        const decoded = JSON.parse(decodeURIComponent(atob(payload.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
        // Normalize claim keys to make lookup easier
        const normalized = {};
        Object.keys(decoded).forEach((k) => {
          normalized[k] = decoded[k];
          normalized[k.toLowerCase()] = decoded[k];
        });
        setUserInfo(normalized);
      }
    } catch (e) {
      // ignore decode errors
      setUserInfo(null);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Welcome — you are logged in.</p>

      <div style={{ marginTop: '1rem' }}>
        <button
          onClick={() => setShowToken((s) => !s)}
          style={{ padding: '0.5rem 1rem' }}
        >
          {showToken ? 'Hide token' : 'Show token'}
        </button>
      </div>

      {showToken && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ background: '#f4f4f4', padding: '1rem', borderRadius: 6, wordBreak: 'break-all' }}>
            {token || 'No token found'}
          </div>
        </div>
      )}

      {userInfo && (
        <div style={{ marginTop: '1.5rem', background: '#fff', padding: '1rem', borderRadius: 6, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
          <h3 style={{ marginTop: 0 }}>User Info</h3>
          <div style={{ color: '#333' }}>
            <div>
              <strong>Name:</strong>{' '}
              {userInfo.name ?? userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? userInfo['unique_name'] ?? userInfo['fullname'] ?? userInfo['given_name'] ?? '—'}
            </div>
            <div>
              <strong>Email:</strong>{' '}
              {userInfo.email ?? userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? userInfo['preferred_username'] ?? '—'}
            </div>
            <div>
              <strong>ID:</strong>{' '}
              {userInfo.sub ?? userInfo.id ?? userInfo.userid ?? userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? '—'}
            </div>
            <div>
              <strong>Role:</strong>{' '}
              {userInfo.role ?? userInfo['role'] ?? userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? 'User'}
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default Dashboard;
