import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, User as UserIcon, ListOrdered, ShieldCheck } from 'lucide-react';

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
                        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders`),
                        axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`)
                    ]);
                    setAllOrders(ordersRes.data);
                    setAllProducts(productsRes.data);
                } else {
                    const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/orders/myorders`);
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

    if (loading) {
        return <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>Loading dashboard data...</div>;
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 0 4rem 0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '500' }}>My Account</h1>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', alignItems: 'flex-start' }}>
                {/* Left Sidebar: Profile Card */}
                <div className="card" style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '24px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid var(--border-color)', background: '#fff' }}>
                        <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--primary-color)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <UserIcon size={28} />
                        </div>
                        <div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Hello,</p>
                            <h2 style={{ fontSize: '1.25rem', fontWeight: '500' }}>{user.name}</h2>
                        </div>
                    </div>
                    <div style={{ padding: '24px', background: '#fff', flex: 1 }}>
                        <div style={{ marginBottom: '16px' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Email Address</p>
                            <p style={{ fontWeight: '500' }}>{user.email}</p>
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>Account Type</p>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: user.role === 'admin' ? '#f0ebff' : '#e6f4ea', color: user.role === 'admin' ? '#6200ea' : '#1e8e3e', padding: '4px 12px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                {user.role === 'admin' && <ShieldCheck size={16} />}
                                {user.role}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Content */}
                <div style={{ flex: '2 1 600px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {user.role === 'admin' ? (
                        <>
                            <div className="card" style={{ padding: '0', background: '#fff' }}>
                                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <ListOrdered size={22} color="var(--primary-color)" />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '500' }}>Administrative Overview: All Orders ({allOrders.length})</h3>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    {allOrders.map(order => (
                                        <div key={order._id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                                            <div>
                                                <p style={{ fontWeight: '500', marginBottom: '4px' }}>Order #{order._id}</p>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>User: {order.user?.name || 'Unknown'}</p>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <p style={{ fontWeight: '500', marginBottom: '4px' }}>${order.totalAmount.toFixed(2)}</p>
                                                <span style={{ fontSize: '0.85rem', fontWeight: '500', color: order.status === 'Delivered' ? '#1e8e3e' : '#f57c00' }}>
                                                    {order.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="card" style={{ padding: '0', background: '#fff' }}>
                                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Package size={22} color="var(--primary-color)" />
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '500' }}>Product Inventory ({allProducts.length})</h3>
                                </div>
                                <div style={{ padding: '24px' }}>
                                    {allProducts.map(product => (
                                        <div key={product._id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)' }}>
                                            <span style={{ fontWeight: '500' }}>{product.name}</span>
                                            <span style={{ fontWeight: '500', color: 'var(--text-secondary)' }}>${product.price.toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="card" style={{ padding: '0', background: '#fff' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <ListOrdered size={22} color="var(--primary-color)" />
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '500' }}>My Orders</h3>
                            </div>
                            <div style={{ padding: '24px' }}>
                                {orders.length === 0 ? (
                                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                        <p style={{ color: 'var(--text-secondary)' }}>You have no orders yet.</p>
                                    </div>
                                ) : (
                                    orders.map(order => (
                                        <div key={order._id} style={{ border: '1px solid var(--border-color)', borderRadius: '4px', marginBottom: '24px', overflow: 'hidden' }}>
                                            <div style={{ background: '#f5f5f5', padding: '16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)' }}>
                                                <div>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Order Placed</p>
                                                    <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Total</p>
                                                    <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>${order.totalAmount.toFixed(2)}</p>
                                                </div>
                                                <div>
                                                    <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Order #</p>
                                                    <p style={{ fontWeight: '500', fontSize: '0.95rem' }}>{order._id.substring(18)}</p>
                                                </div>
                                            </div>
                                            <div style={{ padding: '24px', background: '#fff' }}>
                                                <div style={{ marginBottom: '16px' }}>
                                                    <h4 style={{ fontSize: '1.1rem', fontWeight: '500', color: order.status === 'Delivered' ? '#1e8e3e' : '#f57c00' }}>
                                                        {order.status}
                                                    </h4>
                                                </div>
                                                {order.items.map(item => (
                                                    <div key={item.product} style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
                                                        <div style={{ width: '80px', height: '80px', flexShrink: 0, padding: '4px', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                                                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} onError={(e) => { e.target.src = 'https://via.placeholder.com/80?text=Img' }} />
                                                        </div>
                                                        <div style={{ flex: 1 }}>
                                                            <p style={{ fontWeight: '500', marginBottom: '4px' }}>{item.name}</p>
                                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Qty: {item.quantity}</p>
                                                        </div>
                                                        <div style={{ fontWeight: '500' }}>
                                                            ${(item.price * item.quantity).toFixed(2)}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
