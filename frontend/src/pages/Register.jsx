import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Store } from 'lucide-react';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await register(name, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please correctly format your credentials.');
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
                <h2 style={{ marginBottom: '1.5rem', fontWeight: '500', fontSize: '1.5rem', color: 'var(--text-primary)' }}>Create Account</h2>
                {error && <div style={{ color: '#d32f2f', marginBottom: '1rem', padding: '10px', background: '#ffebee', borderRadius: '4px', fontSize: '0.9rem' }}>{error}</div>}
                
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Your name</label>
                        <input type="text" value={name} onChange={e => setName(e.target.value)} required placeholder="First and last name" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="Email address" />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>Password</label>
                        <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="At least 6 characters" />
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Passwords must be at least 6 characters.</p>
                    </div>
                    <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', padding: '14px' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Continue'}
                    </button>
                    
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', marginTop: '1rem', lineHeight: '1.5' }}>
                        By continuing, you agree to E-Store's Conditions of Use and Privacy Notice.
                    </p>
                </form>
                
                <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-primary)' }}>Already have an account? </span>
                    <Link to="/login" style={{ color: 'var(--primary-color)', fontWeight: '500' }}>Sign in <span aria-hidden="true">&rarr;</span></Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
