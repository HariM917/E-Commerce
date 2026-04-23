import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Store } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';

const Header = () => {
    const { cartItems } = useContext(CartContext);
    const { user, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        // Optional search logic could be placed here
    };

    const cartCount = cartItems ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <header style={{
            backgroundColor: 'var(--primary-color)',
            padding: '12px 0',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            boxShadow: 'var(--shadow-md)'
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '20px'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff' }}>
                    <Store size={28} />
                    <span style={{ fontSize: '1.5rem', fontWeight: 'bold', fontStyle: 'italic', letterSpacing: '0.5px' }}>E-Store</span>
                </Link>

                <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: '600px', display: 'flex' }}>
                    <input 
                        type="text" 
                        placeholder="Search for products, brands and more"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '10px 16px',
                            border: 'none',
                            borderRadius: '2px 0 0 2px',
                            outline: 'none',
                            fontSize: '0.95rem'
                        }}
                    />
                    <button type="submit" style={{
                        backgroundColor: '#fff',
                        padding: '0 16px',
                        borderRadius: '0 2px 2px 0',
                        color: 'var(--primary-color)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Search size={20} />
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: '#fff', fontWeight: '500' }}>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Link to="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <User size={20} />
                                <span>{user.name.split(' ')[0]}</span>
                            </Link>
                            <button onClick={() => { logout(); navigate('/'); }} style={{ color: '#fff', fontSize: '0.9rem', cursor: 'pointer' }}>
                                Logout
                            </button>
                        </div>
                    ) : (
                        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', color: 'var(--primary-color)', padding: '6px 16px', borderRadius: '2px', fontWeight: '500' }}>
                            Login
                        </Link>
                    )}

                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                        <ShoppingCart size={22} />
                        <span>Cart</span>
                        {cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '35px',
                                background: 'var(--secondary-color)',
                                color: '#fff',
                                fontSize: '0.75rem',
                                padding: '2px 6px',
                                borderRadius: '10px',
                                fontWeight: 'bold'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
