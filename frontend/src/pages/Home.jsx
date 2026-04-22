import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/products');
                setProducts(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}><h2>Loading...</h2></div>;

    return (
        <div className="container animate-fade-in" style={{ marginTop: '2rem' }}>
            <h1 style={{ marginBottom: '2rem', textAlign: 'center' }}>Featured Products</h1>
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {products.length === 0 ? (
                    <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No products found! Please add them from the admin panel.</p>
                ) : (
                    products.map((product, idx) => (
                        <div key={product._id} className={`glass-panel delay-${(idx % 3) + 1}`} style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ height: '200px', background: 'rgba(0,0,0,0.5)', overflow: 'hidden' }}>
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                                />
                            </div>
                            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ marginBottom: '0.5rem' }}>{product.name}</h3>
                                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', flex: 1 }}>{product.category}</p>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--accent)' }}>
                                        ${product.price.toFixed(2)}
                                    </span>
                                    <Link to={`/products/${product._id}`} className="btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                                        View
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Home;
