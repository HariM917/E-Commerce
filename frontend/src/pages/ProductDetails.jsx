import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/products/${id}`);
                setProduct(res.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        addToCart(product);
        navigate('/cart');
    };

    if (loading) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}><h2>Loading...</h2></div>;
    if (!product) return <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}><h2>Product Not Found</h2></div>;

    return (
        <div className="container animate-fade-in" style={{ marginTop: '4rem' }}>
            <div className="glass-panel" style={{ display: 'flex', flexWrap: 'wrap', padding: '0' }}>
                <div style={{ flex: '1 1 400px', background: 'rgba(0,0,0,0.5)', minHeight: '400px' }}>
                    <img 
                        src={product.image} 
                        alt={product.name} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image' }}
                    />
                </div>
                <div style={{ flex: '1 1 400px', padding: '3rem' }}>
                    <h1 style={{ marginBottom: '1rem', fontSize: '2.5rem' }}>{product.name}</h1>
                    <div style={{ color: 'var(--accent)', fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                        ${product.price.toFixed(2)}
                    </div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
                        Category: {product.category}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem' }}>
                        In Stock: {product.stock}
                    </p>
                    <p style={{ marginBottom: '3rem', lineHeight: '1.6', fontSize: '1.1rem' }}>
                        {product.description}
                    </p>
                    <button 
                        className="btn-primary" 
                        style={{ width: '100%', padding: '1rem' }} 
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                    >
                        {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </button>
                    <button 
                        className="btn-secondary" 
                        style={{ width: '100%', padding: '1rem', marginTop: '1rem' }} 
                        onClick={() => navigate('/')}
                    >
                        Back to Shop
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
