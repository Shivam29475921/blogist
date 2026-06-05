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
        <nav style={styles.nav}>
            <Link to="/posts" style={styles.brand}>Folio</Link>
            <div style={styles.links}>
                {user ? (
                    <>
                        <span style={styles.username}>@{user.username}</span>
                        <Link to="/posts/create" style={styles.link}>Write</Link>
                        <button onClick={handleLogout} style={styles.button}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={styles.link}>Login</Link>
                        <Link to="/register" style={styles.link}>Register</Link>
                    </>
                )}
            </div>
        </nav>
    )
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 32px',
        backgroundColor: '#111',
        color: '#fff',
    },
    brand: {
        color: '#fff',
        textDecoration: 'none',
        fontSize: '22px',
        fontWeight: 'bold',
        letterSpacing: '2px',
    },
    links: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
    },
    link: {
        color: '#ccc',
        textDecoration: 'none',
        fontSize: '14px',
    },
    username: {
        color: '#888',
        fontSize: '14px',
    },
    button: {
        background: 'none',
        border: '1px solid #444',
        color: '#ccc',
        padding: '6px 12px',
        cursor: 'pointer',
        borderRadius: '4px',
        fontSize: '14px',
    }
}

export default Navbar