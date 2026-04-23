import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

const ProductDetails = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products/${id}`);
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

    if (loading) {
        return (
            <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
                <div style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: 'bold' }}>Loading product details...</div>
            </div>
        );
    }
    
    if (!product) {
        return (
            <div className="container" style={{ marginTop: '4rem', textAlign: 'center' }}>
                <h2>Product Not Found</h2>
                <button className="btn-secondary" style={{ marginTop: '1rem' }} onClick={() => navigate('/')}>Return Home</button>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem 0 4rem 0' }}>
            <button 
                onClick={() => navigate('/')} 
                style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-color)', marginBottom: '1.5rem', fontWeight: '500' }}
            >
                <ArrowLeft size={20} /> Back to Products
            </button>
            
            <div className="card" style={{ display: 'flex', flexWrap: 'wrap', padding: '0', background: '#fff' }}>
                {/* Left Side: Image Gallery */}
                <div style={{ flex: '1 1 450px', padding: '2rem', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '400px', height: '400px', marginBottom: '2rem' }}>
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                            onError={(e) => { e.target.src = 'https://via.placeholder.com/400x400?text=No+Image' }}
                        />
                    </div>
                    
                    <div style={{ display: 'flex', gap: '1rem', width: '100%', maxWidth: '400px' }}>
                        <button 
                            className="btn-primary" 
                            style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', padding: '14px' }} 
                            onClick={handleAddToCart}
                            disabled={product.stock === 0}
                        >
                            <ShoppingCart size={20} />
                            {product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO CART'}
                        </button>
                    </div>
                </div>

                {/* Right Side: Product Info */}
                <div style={{ flex: '1 1 450px', padding: '2rem 3rem' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '500' }}>
                        {product.category}
                    </p>
                    <h1 style={{ marginBottom: '1rem', fontSize: '1.75rem', fontWeight: '400', lineHeight: '1.3', color: 'var(--text-primary)' }}>
                        {product.name}
                    </h1>
                    
                    <div style={{ color: 'var(--text-primary)', fontSize: '2.25rem', fontWeight: '500', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        ${product.price.toFixed(2)}
                    </div>
                    <p style={{ color: product.stock > 0 ? '#388e3c' : '#d32f2f', fontWeight: '600', marginBottom: '2rem', fontSize: '1rem' }}>
                        {product.stock > 0 ? 'In Stock' : 'Currently Unavailable'}
                    </p>
                    
                    {/* Offers / Promises */}
                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1.5rem 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'center' }}>
                            <Truck size={28} color="var(--primary-color)" />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Free Delivery</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'center' }}>
                            <RotateCcw size={28} color="var(--primary-color)" />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>7 Days Replacement</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flex: 1, textAlign: 'center' }}>
                            <ShieldCheck size={28} color="var(--primary-color)" />
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>1 Year Warranty</span>
                        </div>
                    </div>

                    <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', fontWeight: '500' }}>Product Description</h3>
                    <p style={{ lineHeight: '1.6', fontSize: '1rem', color: '#444', wordBreak: 'break-word' }}>
                        {product.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
