import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchData = async () => {
            try {
                if (user.role === 'admin') {
                    const [ordersRes, productsRes] = await Promise.all([
                        axios.get('http://localhost:5000/api/orders'),
                        axios.get('http://localhost:5000/api/products')
                    ]);
                    setAllOrders(ordersRes.data);
                    setAllProducts(productsRes.data);
                } else {
                    const res = await axios.get('http://localhost:5000/api/orders/myorders');
                    setOrders(res.data);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (loading) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}><h2>Loading...</h2></div>;

    return (
        <div className="container animate-fade-in" style={{ marginTop: '4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2.5rem' }}>Overview</h1>
                <button className="btn-secondary" onClick={handleLogout}>Logout</button>
            </div>
            
            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                <h2 style={{ marginBottom: '1rem' }}>Profile Information</h2>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p style={{ display: 'inline-block', padding: '4px 8px', background: 'var(--accent)', color: '#fff', borderRadius: '4px', marginTop: '1rem', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                    {user.role}
                </p>
            </div>

            {user.role === 'admin' ? (
                <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>Admin Controls</h2>
                    <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                        <div className="glass-panel" style={{ flex: '1 1 400px', padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>All Orders ({allOrders.length})</h3>
                            {allOrders.map(order => (
                                <div key={order._id} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                    <p><strong>Order ID:</strong> {order._id}</p>
                                    <p><strong>User:</strong> {order.user?.name || 'Unknown'}</p>
                                    <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
                                    <p><strong>Status:</strong> <span style={{ color: order.status === 'Delivered' ? '#4ade80' : 'var(--accent)' }}>{order.status}</span></p>
                                </div>
                            ))}
                        </div>
                        <div className="glass-panel" style={{ flex: '1 1 400px', padding: '2rem' }}>
                            <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>All Products ({allProducts.length})</h3>
                            {allProducts.map(product => (
                                <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <span>{product.name}</span>
                                    <span>${product.price.toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <h2 style={{ marginBottom: '1.5rem' }}>My Orders</h2>
                    <div className="glass-panel" style={{ padding: '2rem' }}>
                        {orders.length === 0 ? (
                            <p>You have no orders yet.</p>
                        ) : (
                            orders.map(order => (
                                <div key={order._id} style={{ marginBottom: '1.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h3 style={{ fontSize: '1.1rem' }}>Order #{order._id.substring(18)}</h3>
                                        <span style={{ padding: '4px 12px', background: order.status === 'Delivered' ? 'rgba(74, 222, 128, 0.2)' : 'rgba(135, 80, 240, 0.2)', color: order.status === 'Delivered' ? '#4ade80' : 'var(--accent)', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                    <div style={{ marginTop: '1rem' }}>
                                        {order.items.map(item => (
                                            <div key={item.product} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                                                <span>{item.quantity} x {item.name}</span>
                                                <span>${(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                                        Total: ${order.totalAmount.toFixed(2)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
