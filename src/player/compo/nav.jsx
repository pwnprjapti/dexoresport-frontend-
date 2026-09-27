import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FaHome, FaCrown } from "react-icons/fa";
import { MdLeaderboard } from "react-icons/md";
import { ImBlogger2 } from "react-icons/im";
import { FiLogIn } from "react-icons/fi";
import { GiWaterGun } from "react-icons/gi";
import { IoNotificationsOutline, IoPersonOutline } from "react-icons/io5";
import SystemAlertBanner from "./SystemAlertBanner.jsx";
import { useTenant } from '../../context/TenantContext.jsx';

export default function Nav() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isTenant, tenant } = useTenant();

    const [status, setStatus] = useState(null);
    const [menuState, setMenuState] = useState(false);

    const islogedin = async () => {
        const token = localStorage.getItem("jwt");

        if (!token) {
            setStatus(401);
            return;
        }

        try {
            const res = await fetch(`${import.meta.env.VITE_BASE_URL}/islogedin`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setStatus(res.status);
        } catch (err) {
            console.error("Auth check failed:", err);
            setStatus(401);
        }
    };

    useEffect(() => {
        islogedin();
    }, []);

    // Automatically close mobile menu on route change
    useEffect(() => {
        setMenuState(false);
    }, [location.pathname]);

    // Close menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 768) {
                setMenuState(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleMenu = () => {
        setMenuState(!menuState);
    };

    const closeMenu = () => {
        setMenuState(false);
    };

    const isAuthenticated = status === 200;

    return (
        <>
            <SystemAlertBanner />
            <nav>
                <div className="nav-brand" onClick={() => navigate("/")} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {isTenant && tenant ? (
                        tenant.branding?.logo ? (
                            <img className="logo" src={tenant.branding.logo} alt={tenant.organizationName} style={{ maxHeight: '42px', objectFit: 'contain' }} />
                        ) : (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{
                                    width: '38px',
                                    height: '38px',
                                    borderRadius: '10px',
                                    background: 'linear-gradient(135deg, #00f0ff, #7000ff)',
                                    color: '#fff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: '900',
                                    fontSize: '18px',
                                    boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)'
                                }}>
                                    {tenant.organizationName ? tenant.organizationName.charAt(0).toUpperCase() : 'E'}
                                </div>
                                <span style={{
                                    color: '#fff',
                                    fontWeight: '800',
                                    fontSize: '18px',
                                    letterSpacing: '0.5px'
                                }}>
                                    {tenant.organizationName}
                                </span>
                            </div>
                        )
                    ) : (
                        <img className="logo" src="https://res.cloudinary.com/dnfhwfbmq/image/upload/v1777614927/1000076765-removebg-preview_momgvo.png" alt="Dexor Esport" />
                    )}
                </div>

                <button 
                    className={`menu ${menuState ? 'menu-open' : ''}`} 
                    onClick={toggleMenu}
                    aria-label="Toggle Navigation"
                >
                    {menuState ? 'CLOSE' : 'MENU'}
                </button>

                <div className={`links ${menuState ? 'open' : ''}`}>
                    <Link to="/" onClick={closeMenu} className={location.pathname === '/' ? 'active-link' : ''}>
                        <FaHome /> Home
                    </Link>
                    <Link to="/tournaments" onClick={closeMenu} className={location.pathname.startsWith('/tournaments') ? 'active-link' : ''}>
                        <GiWaterGun /> Tournaments
                    </Link>
                    <Link to="/leaderboard" onClick={closeMenu} className={location.pathname.startsWith('/leaderboard') ? 'active-link' : ''}>
                        <MdLeaderboard /> Leaderboard
                    </Link>
                    <Link to="/blog" onClick={closeMenu} className={location.pathname === '/blog' ? 'active-link' : ''}>
                        <ImBlogger2 /> Blog
                    </Link>
                    
                    {!isTenant && (
                        <Link 
                            to="/organizer" 
                            onClick={closeMenu} 
                            className={location.pathname.startsWith('/organizer') ? 'active-link nav-org-pill' : 'nav-org-pill'}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'linear-gradient(135deg, rgba(254, 38, 244, 0.15), rgba(0, 240, 255, 0.15))',
                                border: '1px solid rgba(254, 38, 244, 0.4)',
                                borderRadius: '20px',
                                padding: '6px 14px',
                                color: '#00f0ff',
                                fontSize: '13px',
                                fontWeight: '600'
                            }}
                        >
                            <FaCrown style={{ color: '#fe26f4' }} /> For Organizers
                        </Link>
                    )}

                    {isAuthenticated ? (
                        <>
                            <Link to="/notification" onClick={closeMenu} className={location.pathname === '/notification' ? 'active-link' : ''}>
                                <IoNotificationsOutline /> Notification
                            </Link>
                            <Link to="/profile" onClick={closeMenu} className={location.pathname === '/profile' ? 'active-link' : ''}>
                                <IoPersonOutline /> Profile
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link to="/login" onClick={closeMenu} className={location.pathname === '/login' ? 'active-link' : ''}>
                                <FiLogIn /> Login
                            </Link>
                            <button 
                                className="nav-join-btn"
                                onClick={() => {
                                    closeMenu();
                                    navigate("/signup");
                                }}
                            >
                                Join now
                            </button>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile backdrop for easy dismissal */}
            {menuState && <div className="nav-backdrop" onClick={closeMenu}></div>}
        </>
    );
}