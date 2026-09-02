import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Register() {
    const [step, setStep] = useState(1) // 1: Info, 2: OTP
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [otp, setOtp] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState('')
    const [successMessage, setSuccessMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [resendTimer, setResendTimer] = useState(0)

    const { login } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        let interval = null
        if (resendTimer > 0) {
            interval = setInterval(() => {
                setResendTimer(prev => prev - 1)
            }, 1000)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [resendTimer])

    const handleSendOTP = async (e) => {
        e.preventDefault()
        const trimmedEmail = email.trim().toLowerCase()
        const trimmedUsername = username.trim()
        if (!trimmedEmail || !trimmedUsername || !password) {
            setError('Please fill in all fields.')
            return
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters.')
            return
        }

        setLoading(true)
        setError('')
        setSuccessMessage('')

        try {
            const res = await authAPI.sendOTP({ email: trimmedEmail, username: trimmedUsername })
            setSuccessMessage(res.data.message || `Verification code sent to ${trimmedEmail}`)
            setStep(2)
            setResendTimer(60)
        } catch (err) {
            const data = err.response?.data
            if (data?.error) {
                setError(data.error)
            } else if (data) {
                setError(Object.values(data).flat().join(' '))
            } else {
                setError('Failed to send verification code. Please check your connection.')
            }
        } finally {
            setLoading(false)
        }
    }

    const handleResendOTP = async () => {
        if (resendTimer > 0 || loading) return
        setLoading(true)
        setError('')
        setSuccessMessage('')

        try {
            const res = await authAPI.sendOTP({ email: email.trim().toLowerCase(), username: username.trim() })
            setSuccessMessage(res.data.message || 'New verification code sent.')
            setResendTimer(60)
        } catch (err) {
            const data = err.response?.data
            setError(data?.error || 'Failed to resend verification code. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyAndRegister = async (e) => {
        e.preventDefault()
        const trimmedOtp = otp.trim()

        if (!trimmedOtp || trimmedOtp.length !== 6) {
            setError('Please enter the 6-digit verification code.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const response = await authAPI.register({
                email: email.trim().toLowerCase(),
                username: username.trim(),
                password,
                otp: trimmedOtp,
            })

            if (response.data.tokens) {
                login(response.data.user, response.data.tokens.access, response.data.tokens.refresh)
                navigate('/posts')
            } else {
                navigate('/login')
            }
        } catch (err) {
            const data = err.response?.data
            if (data?.otp) {
                setError(Array.isArray(data.otp) ? data.otp.join(' ') : data.otp)
            } else if (data?.error) {
                setError(data.error)
            } else if (data) {
                setError(Object.values(data).flat().join(' '))
            } else {
                setError('Registration failed. Please check the code and try again.')
            }
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

                {step === 1 ? (
                    <>
                        <p style={styles.kicker}>NEW ACCOUNT · FIRST EDITION</p>
                        <h2 style={styles.title}>Start writing.</h2>

                        {error && <div style={styles.error}>{error}</div>}

                        <form onSubmit={handleSendOTP} style={styles.form}>
                            <div style={styles.field}>
                                <label style={styles.label} htmlFor="email">EMAIL ADDRESS</label>
                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    autoComplete="username"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    required
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label} htmlFor="username">USERNAME</label>
                                <input
                                    id="username"
                                    type="text"
                                    name="username"
                                    autoComplete="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={styles.input}
                                    placeholder="yourname"
                                    required
                                />
                            </div>

                            <div style={styles.field}>
                                <label style={styles.label} htmlFor="new-password">PASSWORD</label>
                                <div style={{ position: 'relative' }}>
                                    <input
                                        id="new-password"
                                        name="new-password"
                                        autoComplete="new-password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        style={{ ...styles.input, width: '100%', boxSizing: 'border-box', paddingRight: 44 }}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(v => !v)}
                                        style={styles.showHideBtn}
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? 'HIDE' : 'SHOW'}
                                    </button>
                                </div>
                                <span style={styles.fieldHint}>Minimum 6 characters</span>
                            </div>

                            <button
                                type="submit"
                                style={loading ? styles.buttonDisabled : styles.button}
                                disabled={loading}
                            >
                                {loading ? 'SENDING CODE...' : 'CONTINUE →'}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <div style={styles.stepBackRow}>
                            <button
                                type="button"
                                onClick={() => { setStep(1); setError(''); setSuccessMessage(''); }}
                                style={styles.backBtn}
                            >
                                ← CHANGE DETAILS
                            </button>
                        </div>

                        <p style={styles.kicker}>VERIFICATION DISPATCH · 6-DIGIT CODE</p>
                        <h2 style={styles.title}>Check your inbox.</h2>

                        <p style={styles.subtext}>
                            We sent a verification code to <span style={{ color: 'rgba(255,255,255,0.95)', fontWeight: 600 }}>{email}</span>. Enter it below to activate your account.
                        </p>

                        {successMessage && <div style={styles.success}>{successMessage}</div>}
                        {error && <div style={styles.error}>{error}</div>}

                        <form onSubmit={handleVerifyAndRegister} style={styles.form}>
                            <div style={styles.field}>
                                <label style={styles.label} htmlFor="otp-input">6-DIGIT CODE</label>
                                <input
                                    id="otp-input"
                                    type="text"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    autoComplete="one-time-code"
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '')
                                        if (val.length <= 6) setOtp(val)
                                    }}
                                    style={styles.otpInput}
                                    placeholder="123456"
                                    autoFocus
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                style={loading || otp.length !== 6 ? styles.buttonDisabled : styles.button}
                                disabled={loading || otp.length !== 6}
                            >
                                {loading ? 'CREATING ACCOUNT...' : 'VERIFY & CREATE ACCOUNT →'}
                            </button>

                            <div style={styles.resendRow}>
                                {resendTimer > 0 ? (
                                    <span style={styles.resendTimerText}>
                                        Resend code in {resendTimer}s
                                    </span>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={handleResendOTP}
                                        style={styles.resendBtn}
                                        disabled={loading}
                                    >
                                        RESEND VERIFICATION CODE
                                    </button>
                                )}
                            </div>
                        </form>
                    </>
                )}

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
        padding: '24px 16px',
        boxSizing: 'border-box',
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
        maxWidth: '420px',
        padding: '44px 38px',
        border: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        boxSizing: 'border-box',
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
    stepBackRow: {
        marginBottom: 12,
    },
    backBtn: {
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.4)',
        cursor: 'pointer',
        fontSize: 10,
        fontFamily: 'monospace',
        letterSpacing: '0.15em',
        padding: 0,
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
        marginBottom: 14,
        letterSpacing: '-0.02em',
        fontFamily: 'Georgia, serif',
    },
    subtext: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.55)',
        lineHeight: '1.6',
        marginBottom: 20,
        fontFamily: 'DM Sans, sans-serif',
    },
    error: {
        border: '1px solid rgba(200,60,60,0.4)',
        backgroundColor: 'rgba(200,60,60,0.08)',
        color: 'rgba(220,100,100,0.9)',
        padding: '10px 14px',
        marginBottom: 16,
        fontSize: 12,
        letterSpacing: '0.02em',
        fontFamily: 'monospace',
    },
    success: {
        border: '1px solid rgba(80,180,100,0.4)',
        backgroundColor: 'rgba(80,180,100,0.08)',
        color: 'rgba(100,210,120,0.95)',
        padding: '10px 14px',
        marginBottom: 16,
        fontSize: 12,
        letterSpacing: '0.02em',
        fontFamily: 'monospace',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
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
    otpInput: {
        padding: '12px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.2)',
        color: '#ffffff',
        fontSize: 24,
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '0.4em',
        textAlign: 'center',
        outline: 'none',
        borderRadius: 0,
    },
    fieldHint: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.25)',
        fontFamily: 'monospace',
    },
    showHideBtn: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        color: 'rgba(255,255,255,0.35)',
        fontSize: 12,
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
    },
    button: {
        padding: '13px',
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
        padding: '13px',
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: 'rgba(255,255,255,0.4)',
        border: 'none',
        fontSize: 10,
        letterSpacing: '0.25em',
        fontFamily: 'monospace',
        cursor: 'not-allowed',
        marginTop: 4,
    },
    resendRow: {
        textAlign: 'center',
        marginTop: 4,
    },
    resendTimerText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
    },
    resendBtn: {
        background: 'none',
        border: 'none',
        color: 'rgba(255,255,255,0.6)',
        cursor: 'pointer',
        fontSize: 10,
        fontFamily: 'monospace',
        letterSpacing: '0.15em',
        padding: '4px',
        textDecoration: 'underline',
        textUnderlineOffset: 3,
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