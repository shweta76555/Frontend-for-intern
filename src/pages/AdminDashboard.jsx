import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

function AdminDashboard() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [error, setError] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);
  const [showRawToken, setShowRawToken] = useState(false);
  const [showPayload, setShowPayload] = useState(false);
  const [tokenUserDetails, setTokenUserDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      navigate("/login");
      return;
    }

    // don't auto-decode here; provide explicit validation action
    loadUsers();
    loadProjects();
    // validate token and show info automatically after login
    validateToken();
  }, []);

  // decode JWT payload (base64url) without external libs
  const parseJwt = (token) => {
    if (!token) return null;
    const parts = token.split('.');
    if (parts.length < 2) return null;
    try {
      const payload = parts[1];
      const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64.padEnd(base64.length + (4 - (base64.length % 4)) % 4, '=');
      const decoded = atob(padded);
      return JSON.parse(decoded);
    } catch (err) {
      console.error('parseJwt error', err);
      return null;
    }
  };

  const getClaim = (payload, keys = []) => {
    if (!payload) return null;
    for (const k of keys) {
      if (Object.prototype.hasOwnProperty.call(payload, k)) {
        const v = payload[k];
        if (v === undefined || v === null) continue;
        if (Array.isArray(v)) return v.join(', ');
        if (typeof v === 'object') {
          try {
            return JSON.stringify(v);
          } catch (e) {
            return String(v);
          }
        }
        return String(v);
      }
    }
    // try common nested claim names (keys containing 'email'|'role'|'name')
    for (const key of Object.keys(payload)) {
      const low = key.toLowerCase();
      if (low.includes('email')) return String(payload[key]);
      if (low.includes('role') && payload[key]) {
        const val = payload[key];
        return Array.isArray(val) ? val.join(', ') : String(val);
      }
      if (low.includes('name')) return String(payload[key]);
    }
    return null;
  };

  const validateToken = () => {
    setError("");
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No token found in localStorage');
      setTokenInfo(null);
      return;
    }

    const payload = parseJwt(token);
    if (!payload) {
      setError('Invalid token');
      setTokenInfo({ raw: token, payload: null, isExpired: true });
      return;
    }

    const exp = payload.exp; // seconds since epoch
    const expiresAt = exp ? new Date(exp * 1000) : null;
    const isExpired = expiresAt ? Date.now() > expiresAt.getTime() : false;

    setCurrentUser(payload);
    setTokenInfo({ raw: token, payload, expiresAt: expiresAt ? expiresAt.toString() : null, isExpired });

    // if payload contains a user id (common claim names), fetch full user details
    const findIdClaim = (p) => {
      if (!p) return null;
      const idKeys = ['sub','id','user_id','userId','uid','nameid','name_identifier','nameidentifier'];
      for (const k of idKeys) {
        if (Object.prototype.hasOwnProperty.call(p, k) && p[k]) return p[k];
      }
      // nested user object
      if (p.user && (p.user.id || p.user.userId)) return p.user.id || p.user.userId;
      return null;
    };

    const maybeId = findIdClaim(payload);
    if (maybeId) {
      const idStr = String(maybeId);
      if (/^\d+$/.test(idStr)) {
        // fetch user details from API
        (async () => {
          try {
            const res = await axiosInstance.get(`User/${idStr}`);
            setTokenUserDetails(res.data ?? null);
          } catch (err) {
            console.warn('Could not fetch user by id from token', err);
            setTokenUserDetails(null);
          }
        })();
      }
    }
  };

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await axiosInstance.get("User");
      setUsers(res.data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const res = await axiosInstance.get("ProjectItem");
      setProjects(res.data ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load projects");
    } finally {
      setLoadingProjects(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      await axiosInstance.delete(`ProjectItem/${id}`);
      loadProjects();
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    navigate("/login");
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "1rem",
    fontSize: 14,
    background: '#fff'
  };

  const thStyle = {
    padding: "12px 10px",
    background: "#f1f5f9",
    borderBottom: "2px solid #e6eef6",
    textAlign: "left",
    color: '#334155',
    fontWeight: 600,
    fontSize: 13,
    textTransform: 'uppercase',
  };

  const tdStyle = {
    padding: "10px",
    borderBottom: "1px solid #eef2f6",
  };

  const containerStyle = {
    padding: '2rem',
    fontFamily: 'Inter, Arial, sans-serif',
    background: '#f4f7fb',
    minHeight: '100vh'
  };

  const headerBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8
  };

  const headerLeftStyle = {
    display: 'flex',
    flexDirection: 'column',
  };

  const subtitleStyle = { color: '#6b7280', fontSize: 14 };

  const headerActionsStyle = { display: 'flex', gap: 8, alignItems: 'center' };

  const primaryBtn = { padding: '8px 12px', background: '#0f766e', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' };
  const dangerBtn = { padding: '8px 12px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' };

  const cardStyle = { marginTop: 16, padding: 16, background: '#fff', borderRadius: 8, boxShadow: '0 6px 18px rgba(15,23,42,0.06)' };

  return (
    <div style={containerStyle}>
      <div style={headerBarStyle}>
        <div style={headerLeftStyle}>
          <h1 style={{ margin: 0, color: '#0f172a' }}>Admin Database Panel</h1>
          <div style={subtitleStyle}>Manage users and projects — secure admin tools</div>
        </div>
        <div style={headerActionsStyle}>
          <button onClick={validateToken} style={primaryBtn}>Validate Token</button>
          <button onClick={handleLogout} style={dangerBtn}>Logout</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 6 }}>
        <label style={{ fontSize: 14, color: '#333', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" checked={showRawToken} onChange={() => setShowRawToken(s => !s)} style={{ marginRight: 8 }} />
          Show raw token
        </label>
        <label style={{ fontSize: 14, color: '#333', display: 'flex', alignItems: 'center' }}>
          <input type="checkbox" checked={showPayload} onChange={() => setShowPayload(s => !s)} style={{ marginRight: 8 }} />
          Show parsed payload
        </label>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {tokenInfo && (
        <div style={cardStyle}>
          <strong style={{ fontSize: 15 }}>Token info</strong>
          <div style={{ marginTop: 8, color: '#334155' }}>
            <div><strong>Expires at:</strong> {tokenInfo.expiresAt ?? 'N/A'}</div>
            <div><strong>Valid:</strong> {tokenInfo.isExpired ? 'No (expired)' : 'Yes'}</div>
            <div><strong>Name:</strong> {tokenUserDetails?.name || getClaim(tokenInfo.payload, ['name','unique_name','given_name','fullname','fullName','sub','username']) || tokenInfo?.payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || '-'}</div>
            <div><strong>Email:</strong> {tokenUserDetails?.email || getClaim(tokenInfo.payload, ['email','email_address','upn','emails']) || tokenInfo?.payload?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '-'}</div>
            <div><strong>Role:</strong> {tokenUserDetails?.role || getClaim(tokenInfo.payload, ['role','roles','role_name','http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) || tokenInfo?.payload?.['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] || '-'}</div>
            {showRawToken && (
              <div style={{ marginTop: 8, wordBreak: 'break-all', fontSize: 12, color: '#444' }}>{tokenInfo.raw}</div>
            )}
            {showPayload && (
              <pre style={{ marginTop: 8, background: '#f8f9fb', padding: 8, borderRadius: 4, overflowX: 'auto' }}>{JSON.stringify(tokenInfo.payload, null, 2)}</pre>
            )}
          </div>
        </div>
      )}

      {/* USERS TABLE */}
      <div style={{ marginTop: "2rem" }}>
        <h2>All Users</h2>
        {loadingUsers && <p>Loading users...</p>}

        {users.length > 0 && (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={i} style={{ background: i % 2 ? '#ffffff' : '#fbfdff' }}>
                  <td style={tdStyle}>{u.id ?? u.Id}</td>
                  <td style={tdStyle}>{u.name ?? u.Name}</td>
                  <td style={tdStyle}>{u.email ?? u.Email}</td>
                  <td style={tdStyle}>{u.role ?? u.Role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loadingUsers && users.length === 0 && <p>No users found.</p>}
      </div>

      {/* PROJECTS TABLE */}
      <div style={{ marginTop: "3rem" }}>
        <h2>All Projects</h2>
        {loadingProjects && <p>Loading projects...</p>}

        {projects.length > 0 && (
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>ID</th>
                <th style={thStyle}>Title</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>UserId</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={i} style={{ background: i % 2 ? '#ffffff' : '#fbfdff' }}>
                  <td style={tdStyle}>{p.id ?? p.Id}</td>
                  <td style={tdStyle}>{p.title ?? p.Title}</td>
                  <td style={tdStyle}>{p.description ?? p.Description}</td>
                  <td style={tdStyle}>{p.userId ?? p.UserId}</td>
                  <td style={tdStyle}>
                    <button
                      onClick={() => handleDeleteProject(p.id ?? p.Id)}
                      style={{ padding: '6px 10px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 6 }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loadingProjects && projects.length === 0 && <p>No projects found.</p>}
      </div>
    </div>
  );
}

export default AdminDashboard;
