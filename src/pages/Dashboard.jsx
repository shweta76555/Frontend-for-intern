import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

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
    // decode payload as before...
    try {
      const parts = t.split('.');
      if (parts.length >= 2) {
        const payload = parts[1];
        const decoded = JSON.parse(decodeURIComponent(atob(payload.replace(/-/g, '+').replace(/_/g, '/')).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join('')));
        const normalized = {};
        Object.keys(decoded).forEach((k) => {
          normalized[k] = decoded[k];
          normalized[k.toLowerCase()] = decoded[k];
        });
        setUserInfo(normalized);
        console.log('Decoded JWT:', decoded);
      }
    } catch (e) {
      setUserInfo(null);
    }

    const fetchUserDetails = async () => {
      try {
        const res = await axiosInstance.get('auth/me');
        if (res.data) {
          setUserInfo((prev) => ({
            ...prev,
            name: res.data.name || res.data.Name,
            email: res.data.email || res.data.Email,
            id: res.data.id || res.data.Id,
            role: res.data.role || res.data.Role,
          }));
        }
      } catch (err) {
        console.log('Could not fetch user details from API:', err.message);
      }
    };

    setTimeout(fetchUserDetails, 100);

    // automatically load user's items once dashboard mounts
    handleGetMyItems();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    navigate('/login');
  };

  // Create ProjectItem states
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createdItem, setCreatedItem] = useState(null);


  // My items list states
  const [myItems, setMyItems] = useState([]);
  const [myItemsLoading, setMyItemsLoading] = useState(false);
  const [myItemsError, setMyItemsError] = useState('');

  // Edit dialog states
  const [editingItem, setEditingItem] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  const handleCreateProject = async (e) => {
    e?.preventDefault();
    setCreateError('');
    setCreatedItem(null);
    if (!createTitle) {
      setCreateError('Title is required');
      return;
    }
    setCreateLoading(true);
    try {
      const res = await axiosInstance.post('ProjectItem', {
        title: createTitle,
        description: createDescription,
      });
      setCreatedItem(res.data ?? res.data?.result ?? { title: createTitle, description: createDescription });
      setCreateTitle('');
      setCreateDescription('');
    } catch (err) {
      console.error('Create project error', err);
      setCreateError(err.response?.data?.message || err.message || 'Failed to create');
    } finally {
      setCreateLoading(false);
    }
  };



  const handleGetMyItems = async () => {
    setMyItemsError('');
    setMyItems([]);
    setMyItemsLoading(true);
    try {
      const res = await axiosInstance.get('ProjectItem/my-items');
      const items = res.data ?? res.data?.result ?? [];
      setMyItems(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error('Fetch my items error', err);
      setMyItemsError(err.response?.data?.message || err.message || 'Failed to fetch my items');
    } finally {
      setMyItemsLoading(false);
    }
  };

  const handleUpdateItem = async (item) => {
    setEditingItem(item);
    setEditTitle(item.title ?? item.Title ?? '');
    setEditDesc(item.description ?? item.Description ?? '');
  };

  const handleSubmitEdit = async () => {
    if (!editTitle.trim()) {
      alert('Title cannot be empty');
      return;
    }
    setEditLoading(true);
    try {
      await axiosInstance.put(`ProjectItem/${editingItem.id ?? editingItem.Id}`, {
        title: editTitle,
        description: editDesc,
      });
      setEditingItem(null);
      handleGetMyItems();
    } catch (err) {
      console.error('Update error', err);
      alert(err.response?.data?.message || err.message || 'Failed to update');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteItem = async (item) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await axiosInstance.delete(`ProjectItem/${item.id ?? item.Id}`);
      handleGetMyItems();
    } catch (err) {
      console.error('Delete error', err);
      alert(err.response?.data?.message || err.message || 'Failed to delete');
    }
  };

  const containerStyle = { padding: '2rem', fontFamily: 'Arial, sans-serif', background: '#f0f2f5', minHeight: '100vh' };
  const topBarStyle = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: '1rem', background: '#fff', padding: '1rem', borderRadius: 8, boxShadow: '0 1px 4px rgba(0,0,0,0.1)' };
  const gridStyle = { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', marginTop: '1.5rem' };
  const mainStyle = { display: 'grid', gap: '1.5rem' };
  const cardStyle = { background: '#fff', padding: '1.25rem', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.1)', marginBottom: '1rem' };
  const labelStyle = { color: '#333', fontSize: 14, marginTop: 6 };
  const headingStyle = { marginTop: 0, marginBottom: '0.75rem', color: '#222' };
  const inputStyle = { padding: '0.6rem', borderRadius: 6, border: '1px solid #ccc', width: '100%', boxSizing: 'border-box', marginTop: 4 };
  const buttonBase = { padding: '0.6rem 1rem', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' };
  return (
    <div style={containerStyle}>
      <div style={topBarStyle}>
        <div>
          <h1 style={{ margin: 0 }}>User-Dashboard</h1>
          <div style={{ color: '#666', marginTop: 6 }}>Welcome — you are logged in.</div>
        </div>

        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <button onClick={() => setShowToken((s) => !s)} style={{...buttonBase, background: '#888', padding: '0.5rem 0.75rem'}}>
            {showToken ? 'Hide token' : 'Show token'}
          </button>
          <button onClick={handleLogout} style={{...buttonBase, background: '#ef5350', padding: '0.5rem 0.75rem'}}>
            Logout
          </button>
        </div>
      </div>

      <div style={gridStyle}>
        <aside style={cardStyle}>
          <h3 style={headingStyle}>User Profile</h3>
          {userInfo ? (
            <div>
              <div style={labelStyle}><strong>Name:</strong></div>
              <div>{userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ?? userInfo.name ?? userInfo.Name ?? '—'}</div>

              <div style={labelStyle}><strong>Email:</strong></div>
              <div>{userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? userInfo.email ?? userInfo.Email ?? '—'}</div>

              <div style={labelStyle}><strong>ID:</strong></div>
              <div>{userInfo['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] ?? userInfo.id ?? userInfo.Id ?? userInfo.sub ?? '—'}</div>

              <div style={labelStyle}><strong>Role:</strong></div>
              <div>{userInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ?? userInfo.role ?? userInfo.Role ?? 'User'}</div>

              {showToken && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, color: '#999', marginBottom: 6 }}>JWT Payload (all claims):</div>
                  <div style={{ background: '#f4f4f4', padding: 8, borderRadius: 6, wordBreak: 'break-all', fontSize: 10, maxHeight: 200, overflowY: 'auto' }}>
                     
                  </div>
                  <div style={{ fontSize: 12, color: '#999', marginBottom: 6, marginTop: 12 }}>Complete JWT:</div>
                  <div style={{ background: '#f4f4f4', padding: 8, borderRadius: 6, wordBreak: 'break-all', fontSize: 11 }}>{token}</div>
                </div>
              )}
            </div>
          ) : (
            <div>Loading user info…</div>
          )}
        </aside>

        <main style={mainStyle}>
          <section style={cardStyle}>
            <h3 style={headingStyle}>Create Project</h3>
            <form onSubmit={handleCreateProject} style={{ display: 'grid', gap: 8 }}>
              <div>
                <label style={labelStyle}>Title</label>
                <input placeholder="Project Title" value={createTitle} onChange={(e) => setCreateTitle(e.target.value)} style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea placeholder="Project Description" value={createDescription} onChange={(e) => setCreateDescription(e.target.value)} style={{...inputStyle, minHeight: 100}} />
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 6 }}>
                <button type="submit" disabled={createLoading} style={{...buttonBase, background: '#1976d2'}}>
                  {createLoading ? 'Creating...' : 'Create Project'}
                </button>
                {createError && <div style={{ color: '#d32f2f' }}>{createError}</div>}
              </div>

              {createdItem && (
                <div style={{ marginTop: 12, background: '#f6ffed', padding: 12, borderRadius: 6, color: '#2e7d32' }}>
                  <strong>✓ Created successfully</strong>
                  <div style={{ marginTop: 6 }}><strong>Title:</strong> {createdItem.title ?? createdItem.Title}</div>
                  <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>ID: {createdItem.id ?? createdItem.Id ?? '—'}</div>
                </div>
              )}
            </form>
          </section>

          <section style={cardStyle}>
            <h3 style={headingStyle}>My Project Items</h3>
            {/* items load automatically */}
            {myItemsError && <div style={{ color: '#d32f2f', marginBottom: 8 }}>{myItemsError}</div>}
            {myItemsLoading && myItems.length === 0 && <div style={{ fontSize: 13, color: '#666', marginTop: 6 }}>Loading your items…</div>}
            {myItems.length > 0 && (
              <div style={{ marginTop: 12, overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#222' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#222' }}>Title</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#222' }}>Description</th>
                      <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#222' }}>Created</th>
                      <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#222' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myItems.map((item, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #e0e0e0' }}>
                        <td style={{ padding: '12px', color: '#666', fontFamily: 'monospace', fontSize: 12 }}>{item.id ?? item.Id ?? '—'}</td>
                        <td style={{ padding: '12px', fontWeight: '500', color: '#222' }}>{item.title ?? item.Title ?? '—'}</td>
                        <td style={{ padding: '12px', color: '#555', fontSize: 12, maxWidth: '300px' }}>{(item.description ?? item.Description ?? '—').substring(0, 60)}{(item.description ?? item.Description ?? '').length > 60 ? '…' : ''}</td>
                        <td style={{ padding: '12px', color: '#999', fontSize: 11 }}>{(item.createdDate || item.CreatedDate) ? new Date(item.createdDate ?? item.CreatedDate).toLocaleDateString() : '—'}</td>
                        <td style={{ padding: '12px', textAlign: 'center', display: 'flex', gap: 6, justifyContent: 'center' }}>
                          <button onClick={() => handleUpdateItem(item)} style={{ ...buttonBase, background: '#f0ad4e', padding: '0.4rem 0.8rem', fontSize: 12, fontWeight: '500' }}>✏ Edit</button>
                          <button onClick={() => handleDeleteItem(item)} style={{ ...buttonBase, background: '#d9534f', padding: '0.4rem 0.8rem', fontSize: 12, fontWeight: '500' }}>✕ Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </main>

        {editingItem && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 4px 20px rgba(0,0,0,0.3)', padding: '2rem', maxWidth: '500px', width: '90%' }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem', color: '#222', fontSize: '1.3rem' }}>Edit Project Item</h3>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Title</label>
                <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} style={inputStyle} placeholder="Project title" />
              </div>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Description</label>
                <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} style={{...inputStyle, minHeight: 100}} placeholder="Project description" />
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setEditingItem(null)} style={{...buttonBase, background: '#999', padding: '0.6rem 1rem'}} disabled={editLoading}>Cancel</button>
                <button onClick={handleSubmitEdit} style={{...buttonBase, background: '#1976d2', padding: '0.6rem 1rem'}} disabled={editLoading}>{editLoading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
