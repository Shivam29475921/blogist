import { useEffect, useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { notificationAPI } from '../api/axios'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const notificationRef = useRef(null)
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
    const [showNotifications, setShowNotifications] = useState(false)
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)

    useEffect(() => {
        if (!user) { setNotifications([]); setUnreadCount(0); return }
        fetchNotifications()
    }, [user])

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (notificationRef.current && !notificationRef.current.contains(e.target))
                setShowNotifications(false)
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const fetchNotifications = async () => {
        try {
            const data = await notificationAPI.getAll()
            setNotifications(data.notifications)
            setUnreadCount(data.unread_count)
        } catch (err) {
            console.error('Failed to load notifications')
        }
    }

    const handleLogout = () => {
        logout()
        navigate('/login')
        setShowLogoutConfirm(false)
    }

    return (
        <>
            <header style={styles.header}>
                <div style={styles.inner}>
                    <div style={styles.left}>
                        <Link to="/posts" style={styles.brand}>
                            Folio
                        </Link>
                    </div>

                    <div style={styles.right}>
                        {user ? (
                            <>
                                <Link to="/posts/create" style={styles.writeBtn}>
                                    Write
                                </Link>
                                <div style={styles.divider} />
                                <div style={styles.notificationWrap} ref={notificationRef}>
                                    <button
                                        onClick={() => {
                                            const opening = !showNotifications
                                            setShowNotifications(opening)
                                            fetchNotifications()
                                            if (opening) {
                                                notificationAPI.markRead().catch(() => {})
                                                setUnreadCount(0)
                                            }
                                        }}
                                        style={styles.bellBtn}
                                        aria-label="Notifications"
                                    >
                                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                                        </svg>
                                        {unreadCount > 0 && (
                                            <span style={styles.badge}>
                                                {unreadCount > 9 ? '9+' : unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    {showNotifications && (
                                        <div style={styles.notificationMenu}>
                                            <div style={styles.notificationHeader}>
                                                NOTIFICATIONS
                                            </div>
                                            {notifications.length === 0 ? (
                                                <p style={styles.notificationEmpty}>
                                                    No notifications yet.
                                                </p>
                                            ) : (
                                                notifications.slice(0, 10).map(item => (
                                                    <Link
                                                        key={`${item.source}-${item.id}`}
                                                        to={item.post_id ? `/posts/${item.post_id}` : `/profile/${item.actor_username}`}
                                                        onClick={() => setShowNotifications(false)}
                                                        style={styles.notificationItem}
                                                    >
                                                        <span>{item.message}</span>
                                                        <small style={styles.notificationTime}>
                                                            {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                        </small>
                                                    </Link>
                                                ))
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div style={styles.divider} />
                                <Link to={`/profile/${user.username}`} style={styles.username}>
                                    @{user.username}
                                </Link>
                                <button onClick={() => setShowLogoutConfirm(true)} style={styles.logoutBtn}>
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={styles.ghostBtn}>Sign in</Link>
                                <Link to="/register" style={styles.solidBtn}>Get started</Link>
                            </>
                        )}
                    </div>
                </div>
            </header>

            {showLogoutConfirm && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Sign out?</h3>
                        <p style={styles.modalText}>
                            You'll need to sign back in to write or interact with posts.
                        </p>
                        <div style={styles.modalActions}>
                            <button onClick={() => setShowLogoutConfirm(false)} style={styles.cancelBtn}>Stay</button>
                            <button onClick={handleLogout} style={styles.confirmBtn}>Sign out</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

const styles = {
    header: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: '#111111',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
    },
    inner: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '0 24px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    left: {
        display: 'flex',
        alignItems: 'center',
        gap: '32px',
    },
    brand: {
        fontFamily: 'Lora, serif',
        fontSize: '22px',
        fontWeight: '600',
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: '-0.3px',
        textDecoration: 'none',
    },
    right: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    divider: {
        width: '1px',
        height: '20px',
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    username: {
        fontSize: '13px',
        color: 'rgba(255,255,255,0.45)',
        fontWeight: '400',
        textDecoration: 'none',
    },
    notificationWrap: {
        position: 'relative',
    },
    bellBtn: {
        position: 'relative',
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,0.12)',
        backgroundColor: 'rgba(255,255,255,0.05)',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: '-4px',
        right: '-4px',
        minWidth: '16px',
        height: '16px',
        padding: '0 4px',
        borderRadius: '999px',
        backgroundColor: '#cc0000',
        color: '#fff',
        fontSize: '10px',
        lineHeight: '16px',
        textAlign: 'center',
    },
    notificationMenu: {
        position: 'absolute',
        top: '40px',
        right: 0,
        width: '300px',
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 12px 32px rgba(0,0,0,0.5)',
        zIndex: 1001,
        overflow: 'hidden',
    },
    notificationHeader: {
        padding: '12px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontSize: '9px',
        fontWeight: '600',
        letterSpacing: '0.25em',
        color: 'rgba(255,255,255,0.35)',
        fontFamily: 'monospace',
    },
    notificationEmpty: {
        margin: 0,
        padding: '16px',
        fontSize: '13px',
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'DM Sans, sans-serif',
    },
    notificationItem: {
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        padding: '12px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        color: 'rgba(255,255,255,0.65)',
        fontSize: '13px',
        lineHeight: '1.4',
        textDecoration: 'none',
        fontFamily: 'DM Sans, sans-serif',
    },
    notificationTime: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: '11px',
    },
    writeBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: 'rgba(255,255,255,0.65)',
        padding: '6px 0',
        textDecoration: 'none',
        fontFamily: 'DM Sans, sans-serif',
    },
    ghostBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: 'rgba(255,255,255,0.55)',
        padding: '7px 14px',
        border: '1px solid rgba(255,255,255,0.12)',
        textDecoration: 'none',
        fontFamily: 'DM Sans, sans-serif',
    },
    solidBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#111',
        backgroundColor: 'rgba(255,255,255,0.9)',
        padding: '7px 16px',
        textDecoration: 'none',
        fontFamily: 'DM Sans, sans-serif',
    },
    logoutBtn: {
        fontSize: '13px',
        color: 'rgba(255,255,255,0.35)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        fontFamily: 'DM Sans, sans-serif',
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#1a1a1a',
        border: '1px solid rgba(255,255,255,0.1)',
        padding: '32px',
        width: '100%',
        maxWidth: '360px',
    },
    modalTitle: {
        fontFamily: 'Lora, serif',
        fontSize: '20px',
        fontWeight: '600',
        color: 'rgba(255,255,255,0.88)',
        marginBottom: '8px',
    },
    modalText: {
        fontSize: '14px',
        color: 'rgba(255,255,255,0.4)',
        marginBottom: '24px',
        lineHeight: '1.6',
        fontFamily: 'DM Sans, sans-serif',
    },
    modalActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
    },
    cancelBtn: {
        padding: '8px 20px',
        backgroundColor: 'transparent',
        color: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.15)',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
    },
    confirmBtn: {
        padding: '8px 20px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#111',
        border: 'none',
        cursor: 'pointer',
        fontSize: '13px',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
    },
}

export default Navbar