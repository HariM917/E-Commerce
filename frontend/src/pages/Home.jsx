import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { CartContext } from '../context/CartContext';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products`);
                setProducts(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold' }}>Loading products...</div>
            </div>
        );
    }

    return (
        <div style={{ paddingBottom: '4rem' }}>
            {/* Minimal Hero Banner Placeholder */}
            <div style={{ background: '#f8f9fa', borderBottom: '1px solid var(--border-color)', padding: '3rem 0', marginBottom: '2rem' }}>
                <div className="container animate-fade-in delay-1" style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
                        Welcome to E-Store
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)' }}>
                        Discover our top-rated products at unbeatable prices
                    </p>
                </div>
            </div>

            <div className="container animate-fade-in delay-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '500' }}>Featured Products</h2>
                </div>

                <div className="product-grid">
                    {products.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', background: '#fff', borderRadius: '4px' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>No products found!</p>
                        </div>
                    ) : (
                        products.map((product) => (
                            <div key={product._id} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '16px' }}>
                                <Link to={`/products/${product._id}`} style={{ display: 'block', height: '220px', marginBottom: '16px', borderRadius: '4px', overflow: 'hidden', background: '#f5f5f5' }}>
                                    <img 
                                        src={product.image} 
                                        alt={product.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '10px' }}
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image' }}
                                    />
                                </Link>
                                
                                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '4px', fontWeight: '500' }}>
                                        {product.category}
                                    </p>
                                    <Link to={`/products/${product._id}`} style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1rem', fontWeight: '400', lineHeight: '1.4', marginBottom: '8px', color: 'var(--text-primary)' }}>
                                            {product.name.length > 50 ? `${product.name.substring(0, 50)}...` : product.name}
                                        </h3>
                                    </Link>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '12px' }}>
                                        <div className="price-tag">
                                            ${product.price.toFixed(2)}
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => addToCart(product)}
                                        disabled={product.stock === 0}
                                        className="btn-primary" 
                                        style={{ 
                                            width: '100%', 
                                            padding: '10px', 
                                            marginTop: '16px',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            gap: '8px',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <ShoppingCart size={18} />
                                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home;
