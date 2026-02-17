import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';

function App() {
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
        <Link to="/" style={navLinkStyle}>Home</Link>
        <Link to="/login" style={navLinkStyle}>Login</Link>
        <Link to="/register" style={navLinkStyle}>Register</Link>
      </nav>
      <Routes>
        <Route path="/" element={
          <div style={centerStyle}>
            <h1 style={headingStyle}>Frontend For Intern task</h1>
          </div>
        } />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
