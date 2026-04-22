import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
        if (!address) {
            alert('Please enter a shipping address');
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
            
            await axios.post('http://localhost:5000/api/orders', {
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
            <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
                <h2>Your cart is empty</h2>
                <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Go Shopping</button>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Shopping Cart</h1>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ flex: '1 1 600px' }}>
                    {cartItems.map((item) => (
                        <div key={item.product} className="glass-panel" style={{ display: 'flex', alignItems: 'center', padding: '1rem', marginBottom: '1rem' }}>
                            <div style={{ width: '80px', height: '80px', background: 'rgba(0,0,0,0.5)', marginRight: '1rem' }}>
                                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Img' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3>{item.name}</h3>
                                <p style={{ color: 'var(--text-secondary)' }}>${item.price.toFixed(2)} x {item.quantity}</p>
                            </div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginRight: '2rem' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>
                            <button onClick={() => removeFromCart(item.product)} style={{ color: '#f87171', fontSize: '1.5rem' }}>&times;</button>
                        </div>
                    ))}
                </div>
                
                <div style={{ flex: '1 1 300px' }}>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        <h2 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>Order Summary</h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem' }}>
                            <span>Total:</span>
                            <span style={{ color: 'var(--accent)', fontWeight: 'bold' }}>${cartTotal.toFixed(2)}</span>
                        </div>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Shipping Address</label>
                            <textarea 
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                rows="3"
                                placeholder="Enter your full address..."
                            ></textarea>
                        </div>
                        <button 
                            className="btn-primary" 
                            style={{ width: '100%', opacity: loading ? 0.7 : 1 }} 
                            onClick={handleCheckout}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Proceed to Checkout'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
