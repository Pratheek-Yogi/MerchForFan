import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import './MyAccountPage.css';
import sessionManager from '../utils/sessionManager';

const MyAccountPage = () => {
    const [user, setUser] = useState(null);
    const [isMobile, setIsMobile] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const userData = sessionManager.getCurrentUser();
        if (!userData) {
            navigate('/login');
            return;
        }
        setUser(userData);

        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) setSidebarOpen(true);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [navigate]);

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            sessionManager.endSession();
            alert('You have been logged out successfully!');
            navigate('/');
        }
    };

    const closeSidebar = () => {
        if (isMobile) setSidebarOpen(false);
    };

    return (
        <div className="my-account-page">
            {/* Mobile Header */}
            {isMobile && (
                <div className="mobile-header">
                    <button 
                        className="menu-toggle"
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                    <h1>My Account</h1>
                </div>
            )}

            {/* Sidebar Overlay */}
            {isMobile && sidebarOpen && (
                <div 
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="sidebar-header">
                    <div className="user-avatar">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                        ) : (
                            <div className="avatar-placeholder">
                                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="user-info">
                        <h3>Welcome back!</h3>
                        <p>{user?.name || 'User'}</p>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    <NavLink 
                        to="/my-account/orders" 
                        className="nav-item"
                        onClick={closeSidebar}
                    >
                        <i className="fas fa-shopping-bag"></i>
                        <span>My Orders</span>
                    </NavLink>

                    <NavLink 
                        to="/my-account/profile" 
                        className="nav-item"
                        onClick={closeSidebar}
                    >
                        <i className="fas fa-user"></i>
                        <span>Profile</span>
                    </NavLink>

                    <NavLink 
                        to="/my-account/password" 
                        className="nav-item"
                        onClick={closeSidebar}
                    >
                        <i className="fas fa-lock"></i>
                        <span>Password</span>
                    </NavLink>

                    <NavLink 
                        to="/my-account/address" 
                        className="nav-item"
                        onClick={closeSidebar}
                    >
                        <i className="fas fa-map-marker-alt"></i>
                        <span>My Address</span>
                    </NavLink>

                    <button 
                        className="nav-item logout-btn"
                        onClick={handleLogout}
                    >
                        <i className="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="content-area">
                <div className="content-header">
                    <div className="breadcrumb">
                        <span>Home</span>
                        <span>/</span>
                        <span>My Account</span>
                    </div>
                </div>
                
                <div className="content-wrapper">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default MyAccountPage;
