import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userType, setUserType] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5052/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password: password,
          userType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data);
        setSuccess('Registration successful! Redirecting to login...');
        // delay navigation to give user time to read message
        setTimeout(() => navigate('/login'), 5000);
      } else {
        setError(data.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred. Please try again.');
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const registerContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 'calc(100vh - 60px)',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: 'Arial, sans-serif',
  };

  const formStyle = {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
  };

  const headingStyle = {
    color: '#183de6ff',
    fontSize: '1.8rem',
    fontWeight: 'bold',
    marginBottom: '1.5rem',
    textAlign: 'center',
  };

  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  const passwordInputWrapperStyle = {
    position: 'relative',
    marginBottom: '1rem',
  };

  const passwordInputFieldStyle = {
    width: '100%',
    padding: '0.75rem 2.5rem 0.75rem 0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  };

  const eyeButtonStyle = {
    position: 'absolute',
    right: '0.75rem',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: '#666',
    padding: '0.25rem',
  };

  const errorStyle = {
    color: '#d32f2f',
    fontSize: '0.875rem',
    marginBottom: '1rem',
    textAlign: 'center',
  };

  const buttonStyle = {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#183de6ff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem',
  };

  const loginLinkStyle = {
    marginTop: '1rem',
    color: '#183de6ff',
    textAlign: 'center',
    cursor: 'pointer',
    textDecoration: 'underline',
  };

  return (
    <div style={registerContainerStyle}>
      <form style={formStyle} onSubmit={handleSubmit}>
        <h1 style={headingStyle}>Register</h1>
        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={{ ...errorStyle, color: 'green' }}>{success}</div>}
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
          required
        />
        {/* user type selection; only user is actionable, admin must be added manually in the database */}
        <select
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
          style={inputStyle}
        >
          <option value="user">User</option>
          <option value="admin" disabled>
            Admin (add manually in DB)
          </option>
        </select>
        <div style={{ fontSize: '0.8rem', color: '#666', marginBottom: '1rem' }}>
          Only users can self‑register here; if you need an admin account,
          add it manually in the database.
        </div>
        <div style={passwordInputWrapperStyle}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={passwordInputFieldStyle}
            required
          />
          <button
            type="button"
            style={eyeButtonStyle}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <div style={passwordInputWrapperStyle}>
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={passwordInputFieldStyle}
            required
          />
          <button
            type="button"
            style={eyeButtonStyle}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
          </button>
        </div>
        <button type="submit" style={buttonStyle} disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
        <div style={loginLinkStyle} onClick={() => navigate('/login')}>
          Already have an account? Login
        </div>
      </form>
    </div>
  );
}

export default Register;
