import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '80vh', padding: '4rem 1rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', marginBottom: '2rem' }}>
                <Store size={32} />
                <span style={{ fontSize: '1.75rem', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '0.5px' }}>E-Store</span>
            </Link>
            
            <div className="card animate-fade-in" style={{ width: '100%', maxWidth: '400px', padding: '2.5rem 2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontWeight: '500', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Sign-In</h2>
                {error && <div style={{ color: '#d32f2f', marginBottom: '1rem', padding: '10px', background: '#ffebee', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Enter your email" />
                    </div>
                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <label style={{ fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
                            <Link to="#" style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>Forgot Password?</Link>
                        </div>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Enter your password" />
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '14px' }} disabled={loading}>
                        {loading ? 'Signing in...' : 'Continue'}
                    </button>
                </form>
                
                <div style={{ marginTop: '2rem', textAlign: 'center', position: 'relative' }}>
                    <div style={{ borderTop: '1px solid var(--border-color)', position: 'absolute', top: '50%', width: '100%', zIndex: 1 }}></div>
                    <span style={{ background: '#fff', padding: '0 10px', position: 'relative', zIndex: 2, color: 'var(--text-secondary)', fontSize: '0.85rem' }}>New to E-Store?</span>
                </div>
                
                <Link to="/register" style={{ display: 'block', marginTop: '1.5rem' }}>
                    <button className="btn-secondary" style={{ width: '100%', padding: '12px' }}>
                        Create your E-Store account
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default Login;
