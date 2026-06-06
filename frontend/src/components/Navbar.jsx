import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    return (
        <header style={styles.header}>
            <div style={styles.inner}>
                {/* Left */}
                <div style={styles.left}>
                    <Link to="/posts" style={styles.brand}>Folio</Link>
                </div>

                {/* Right */}
                <div style={styles.right}>
                    {user ? (
                        <>
                            <Link to="/posts/create" style={styles.writeBtn}>
                                Write
                            </Link>
                            <div style={styles.divider} />
                            <span style={styles.username}>@{user.username}</span>
                            <button onClick={handleLogout} style={styles.logoutBtn}>
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
    },
    writeBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#1a1a1a',
        padding: '6px 0',
        borderBottom: '1px solid transparent',
        transition: 'border-color 0.2s',
    },
    ghostBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#444',
        padding: '7px 14px',
        border: '1px solid #ddd',
        borderRadius: '20px',
    },
    solidBtn: {
        fontSize: '13px',
        fontWeight: '500',
        color: '#fff',
        backgroundColor: '#1a1a1a',
        padding: '7px 16px',
        borderRadius: '20px',
    },
    logoutBtn: {
        fontSize: '13px',
        color: '#888',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        fontFamily: 'DM Sans, sans-serif',
    }
}

export default Navbar