import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api/axios'

function Register() {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            await authAPI.register({ email, username, password })
            navigate('/login')
        } catch (err) {
            const data = err.response?.data
            setError(data ? Object.values(data).flat().join(' ') : 'Registration failed. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div aria-hidden style={styles.grain} />

            <div style={styles.card}>
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <div style={styles.masthead}>
                        <span style={styles.mastheadTitle}>Blogist</span>
                        <span style={styles.mastheadSub}> · the observer</span>
                    </div>
                </Link>

                <div style={styles.divider} />

                <p style={styles.kicker}>NEW ACCOUNT · FIRST EDITION</p>
                <h2 style={styles.title}>Start writing.</h2>

                {error && <div style={styles.error}>{error}</div>}

                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.field}>
                        <label style={styles.label}>EMAIL</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                            placeholder="you@example.com"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>USERNAME</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            style={styles.input}
                            placeholder="yourname"
                            required
                        />
                    </div>

                    <div style={styles.field}>
                        <label style={styles.label}>PASSWORD</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ ...styles.input, width: '100%', boxSizing: 'border-box', paddingRight: 44 }}
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(v => !v)}
                                style={{
                                    position: 'absolute',
                                    right: 12,
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: 0,
                                    color: 'rgba(255,255,255,0.35)',
                                    fontSize: 13,
                                    fontFamily: 'monospace',
                                    letterSpacing: '0.05em',
                                }}
                            >
                                {showPassword ? 'HIDE' : 'SHOW'}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        style={loading ? styles.buttonDisabled : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'CREATING...' : 'CREATE ACCOUNT →'}
                    </button>
                </form>

                <div style={styles.divider} />

                <p style={styles.footer}>
                    Already a reader?{' '}
                    <Link to="/login" style={styles.link}>Sign in</Link>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#080808',
        fontFamily: 'Georgia, serif',
        position: 'relative',
    },
    grain: {
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        opacity: 0.045,
        mixBlendMode: 'overlay',
        zIndex: 0,
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
    },
    card: {
        position: 'relative',
        zIndex: 1,
        width: '100%',
        maxWidth: '400px',
        padding: '48px 40px',
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.02)',
    },
    masthead: {
        marginBottom: 0,
    },
    mastheadTitle: {
        fontSize: 22,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.92)',
        letterSpacing: '-0.01em',
        fontFamily: 'Georgia, serif',
    },
    mastheadSub: {
        fontSize: 22,
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'Georgia, serif',
    },
    divider: {
        height: 1,
        background: 'rgba(255,255,255,0.08)',
        margin: '20px 0',
    },
    kicker: {
        fontSize: 9,
        letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 28,
        letterSpacing: '-0.02em',
        fontFamily: 'Georgia, serif',
    },
    error: {
        border: '1px solid rgba(200,60,60,0.4)',
        backgroundColor: 'rgba(200,60,60,0.08)',
        color: 'rgba(220,100,100,0.9)',
        padding: '10px 14px',
        marginBottom: 16,
        fontSize: 12,
        letterSpacing: '0.05em',
        fontFamily: 'monospace',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
    },
    label: {
        fontSize: 9,
        letterSpacing: '0.25em',
        color: 'rgba(255,255,255,0.35)',
        fontFamily: 'monospace',
    },
    input: {
        padding: '11px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.85)',
        fontSize: 14,
        fontFamily: 'Georgia, serif',
        outline: 'none',
        borderRadius: 0,
    },
    button: {
        padding: '12px',
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#080808',
        border: 'none',
        fontSize: 10,
        letterSpacing: '0.25em',
        fontFamily: 'monospace',
        fontWeight: 700,
        cursor: 'pointer',
        marginTop: 4,
    },
    buttonDisabled: {
        padding: '12px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'rgba(255,255,255,0.4)',
        border: 'none',
        fontSize: 10,
        letterSpacing: '0.25em',
        fontFamily: 'monospace',
        cursor: 'not-allowed',
        marginTop: 4,
    },
    footer: {
        textAlign: 'center',
        fontSize: 12,
        color: 'rgba(255,255,255,0.28)',
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
    },
    link: {
        color: 'rgba(255,255,255,0.7)',
        textDecoration: 'underline',
        textUnderlineOffset: 3,
    },
}

export default Register