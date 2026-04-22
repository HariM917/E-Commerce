import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Dashboard from './pages/Dashboard';

const Navigation = () => (
    <nav className="animate-fade-in delay-1">
        <div className="container nav-content">
            <Link to="/" className="logo">E-Store</Link>
            <div style={{display: 'flex', gap: '1.5rem', alignItems: 'center'}}>
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/cart" className="nav-link">Cart</Link>
                <Link to="/dashboard" className="nav-link">Dashboard</Link>
                <Link to="/login" className="btn-primary">Login</Link>
            </div>
        </div>
    </nav>
);

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <Router>
                    <Navigation />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/products/:id" element={<ProductDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </Router>
            </CartProvider>
        </AuthProvider>
    );
}

export default App;
