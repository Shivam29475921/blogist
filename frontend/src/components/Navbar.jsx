import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

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
                                <Link
                                    to={`/profile/${user.username}`}
                                    style={styles.username}
                                >
                                    @{user.username}
                                </Link>
                                <button
                                    onClick={() => setShowLogoutConfirm(true)}
                                    style={styles.logoutBtn}
                                >
                                    Sign out
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" style={styles.ghostBtn}>
                                    Sign in
                                </Link>
                                <Link to="/register" style={styles.solidBtn}>
                                    Get started
                                </Link>
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
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                style={styles.cancelBtn}
                            >
                                Stay
                            </button>
                            <button
                                onClick={handleLogout}
                                style={styles.confirmBtn}
                            >
                                Sign out
                            </button>
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
        backgroundColor: '#faf9f7',
        borderBottom: '1px solid #e8e4de',
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
        color: '#1a1a1a',
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
        backgroundColor: '#e0dbd3',
    },
    username: {
        fontSize: '13px',
        color: '#888',
        fontWeight: '400',
        textDecoration: 'none',
    },
    writeBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#1a1a1a',
        padding: '6px 0',
        textDecoration: 'none',
    },
    ghostBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#444',
        padding: '7px 14px',
        border: '1px solid #ddd',
        borderRadius: '20px',
        textDecoration: 'none',
    },
    solidBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#fff',
        backgroundColor: '#1a1a1a',
        padding: '7px 16px',
        borderRadius: '20px',
        textDecoration: 'none',
    },
    logoutBtn: {
        fontSize: '13px',
        color: '#888',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        fontFamily: 'DM Sans, sans-serif',
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
    },
    modal: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '32px',
        width: '100%',
        maxWidth: '360px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    },
    modalTitle: {
        fontFamily: 'Lora, serif',
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '8px',
    },
    modalText: {
        fontSize: '14px',
        color: '#888',
        marginBottom: '24px',
        lineHeight: '1.6',
    },
    modalActions: {
        display: 'flex',
        gap: '12px',
        justifyContent: 'flex-end',
    },
    cancelBtn: {
        padding: '8px 20px',
        backgroundColor: '#fff',
        color: '#444',
        border: '1px solid #ddd',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'DM Sans, sans-serif',
    },
    confirmBtn: {
        padding: '8px 20px',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '14px',
        fontFamily: 'DM Sans, sans-serif',
    },
}

export default Navbar