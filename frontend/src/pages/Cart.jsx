import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Trash2, ShieldCheck, Package } from 'lucide-react';

const Cart = () => {
    const { cartItems, removeFromCart, clearCart, cartTotal } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCheckout = async () => {
        if (!user) {
            navigate('/login');
            return;
        }
        if (!address.trim()) {
            alert('Please enter a valid shipping address');
            return;
        }
        
        try {
            setLoading(true);
            const orderItems = cartItems.map(item => ({
                product: item.product,
                name: item.name,
                quantity: item.quantity,
                price: item.price
            }));
            
            await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`, {
                orderItems,
                shippingAddress: address,
                totalAmount: cartTotal
            });
            
            clearCart();
            alert('Order placed successfully!');
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            alert('Checkout failed');
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="container" style={{ padding: '6rem 0', textAlign: 'center' }}>
                <div className="card" style={{ padding: '4rem 2rem', maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <Package size={80} color="#ccc" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: '500' }}>Your cart is empty!</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Add items to it now.</p>
                    <button className="btn-primary" onClick={() => navigate('/')}>Shop Now</button>
                </div>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 0 4rem 0' }}>
            <h1 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '500' }}>Shopping Cart</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', alignItems: 'flex-start' }}>
                
                {/* Left Side: Cart Items */}
                <div className="card" style={{ flex: '1 1 650px', padding: '0' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', background: '#fff' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: '500' }}>My Cart ({cartItems.length})</h2>
                    </div>
                    {cartItems.map((item) => (
                        <div key={item.product} style={{ 
                            display: 'flex', 
                            padding: '24px', 
                            borderBottom: '1px solid var(--border-color)',
                            background: '#fff',
                            alignItems: 'center'
                        }}>
                            <Link to={`/products/${item.product}`} style={{ width: '110px', height: '110px', marginRight: '20px', flexShrink: 0 }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Img' }} />
                            </Link>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <Link to={`/products/${item.product}`}>
                                            <h3 style={{ fontSize: '1.1rem', fontWeight: '400', color: 'var(--text-primary)', marginBottom: '8px' }}>{item.name}</h3>
                                        </Link>
                                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                    <div style={{ fontWeight: '500', fontSize: '1.25rem' }}>
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.product)} 
                                        style={{ color: '#212121', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', fontWeight: '500' }}
                                    >
                                        <Trash2 size={18} color="var(--text-secondary)" />
                                        REMOVE
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    <div style={{ padding: '16px 24px', background: '#fff', display: 'flex', justifyContent: 'flex-end' }}>
                        <button onClick={handleCheckout} className="btn-primary" style={{ padding: '16px 36px' }}>PLACE ORDER</button>
                    </div>
                </div>
                
                {/* Right Side: Price Details */}
                <div className="card" style={{ flex: '1 1 350px', position: 'sticky', top: '90px' }}>
                    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)' }}>
                        <h2 style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Price Details</h2>
                    </div>
                    <div style={{ padding: '24px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '1rem' }}>
                            <span>Price ({cartItems.length} items)</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '1rem' }}>
                            <span>Delivery Charges</span>
                            <span style={{ color: '#388e3c' }}>Free</span>
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 0', borderTop: '1px dashed var(--border-color)', borderBottom: '1px dashed var(--border-color)', marginBottom: '24px', fontSize: '1.25rem', fontWeight: '500' }}>
                            <span>Total Amount</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', fontSize: '0.95rem' }}>Delivery Address</label>
                            <textarea 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="3"
                                placeholder="Enter full address details..."
                                style={{ resize: 'vertical' }}
                            ></textarea>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#388e3c', fontSize: '0.9rem', fontWeight: '500', background: '#f0fdf4', padding: '12px', borderRadius: '4px' }}>
                            <ShieldCheck size={20} /> Safe and Secure Payments.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
