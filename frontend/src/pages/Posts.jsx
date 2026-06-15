import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { postAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Posts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const navigate = useNavigate()
    const [deleteConfirm, setDeleteConfirm] = useState(null)

    useEffect(() => { fetchPosts() }, [])

    const fetchPosts = async () => {
        try {
            const response = await postAPI.getPosts()
            setPosts(response.data)
        } catch (err) {
            console.error('Failed to load posts')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (e, postId) => {
        e.preventDefault()
        e.stopPropagation()
        setDeleteConfirm(postId)
    }

    const confirmDelete = async () => {
        try {
            await postAPI.deletePost(deleteConfirm)
            setPosts(posts.filter(p => p.id !== deleteConfirm))
            setDeleteConfirm(null)
        } catch (err) {
            alert('Failed to delete.')
            setDeleteConfirm(null)
        }
    }

    const handleLike = async (e, postId) => {
        e.preventDefault()
        e.stopPropagation()
        if (!user) { navigate('/login'); return }
        try {
            const response = await postAPI.toggleLike(postId)
            setPosts(posts.map(p =>
                p.id === postId
                    ? { ...p, likes_count: response.data.likes_count, is_liked: response.data.liked }
                    : p
            ))
        } catch (err) {
            console.error('Failed to toggle like')
        }
    }

    if (loading) return (
        <div style={styles.loadingScreen}>
            <p style={styles.loadingText}>Loading...</p>
        </div>
    )

    return (
        <div style={styles.page}>
            {/* Film grain */}
            <div aria-hidden style={styles.grain} />

            {/* Hero */}
            <div style={styles.hero}>
                <p style={styles.heroKicker}>THE FOLIO OBSERVER</p>
                <h1 style={styles.heroTitle}>Ideas worth reading</h1>
                <p style={styles.heroSub}>Thoughtful writing from the Folio community</p>
                {user && (
                    <Link to="/posts/create" style={styles.heroBtn}>
                        Start writing →
                    </Link>
                )}
            </div>

            {/* Feed */}
            <div style={styles.layout}>
                <main style={styles.feed}>
                    {posts.length === 0 ? (
                        <div style={styles.empty}>
                            <p style={styles.emptyTitle}>Nothing here yet</p>
                            <p style={styles.emptySub}>Be the first to publish on Folio</p>
                            {user && (
                                <Link to="/posts/create" style={styles.heroBtn}>
                                    Write the first post
                                </Link>
                            )}
                        </div>
                    ) : (
                        posts.map((post, index) => (
                            <article
                                key={post.id}
                                style={{ ...styles.card, ...(index === 0 ? styles.cardFirst : {}) }}
                                onClick={() => navigate(`/posts/${post.id}`)}
                            >
                                {index === 0 && (
                                    <span style={styles.featuredBadge}>✦ FEATURED</span>
                                )}
                                <div style={styles.cardMeta}>
                                    <Link
                                        to={`/profile/${post.author_username}`}
                                        style={styles.author}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        @{post.author_username}
                                    </Link>
                                    <span style={styles.dot}>·</span>
                                    <span style={styles.date}>
                                        {new Date(post.created_at).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <h2 style={index === 0 ? styles.cardTitleLarge : styles.cardTitle}>
                                    {post.title}
                                </h2>
                                <p style={styles.excerpt}>
                                    {post.content.replace(/[#*`]/g, '').substring(0, 180)}
                                    {post.content.length > 180 ? '...' : ''}
                                </p>
                                <div style={styles.cardFooter}>
                                    <Link
                                        to={`/posts/${post.id}`}
                                        style={styles.readMore}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Read more →
                                    </Link>
                                    <div style={styles.footerRight}>
                                        <button
                                            onClick={(e) => handleLike(e, post.id)}
                                            style={{ ...styles.likeBtn, ...(post.is_liked ? styles.likeBtnActive : {}) }}
                                        >
                                            {post.is_liked ? '♥' : '♡'} {post.likes_count || 0}
                                        </button>
                                        {user && user.id === post.author_id && (
                                            <button
                                                onClick={(e) => handleDelete(e, post.id)}
                                                style={styles.deleteBtn}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </article>
                        ))
                    )}
                </main>

                {/* Sidebar */}
                <aside style={styles.sidebar}>
                    <div style={styles.sideCard}>
                        <h3 style={styles.sideTitle}>About Folio</h3>
                        <p style={styles.sideText}>
                            A platform for developers and thinkers to share ideas.
                            Built with Django microservices, React, and deployed on AWS.
                        </p>
                        {user ? (
                            <Link to="/posts/create" style={styles.sideBtn}>Write a post →</Link>
                        ) : (
                            <Link to="/register" style={styles.sideBtn}>Join Folio →</Link>
                        )}
                    </div>

                    <div style={styles.sideCard}>
                        <h3 style={styles.sideTitle}>Stats</h3>
                        <div style={styles.statRow}>
                            <span style={styles.statNum}>{posts.length}</span>
                            <span style={styles.statLabel}>Posts published</span>
                        </div>
                        <div style={styles.statRow}>
                            <span style={styles.statNum}>4</span>
                            <span style={styles.statLabel}>Microservices</span>
                        </div>
                        <div style={styles.statRow}>
                            <span style={styles.statNum}>AI</span>
                            <span style={styles.statLabel}>Powered by Groq</span>
                        </div>
                    </div>
                </aside>
            </div>

            {deleteConfirm && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Delete post?</h3>
                        <p style={styles.modalText}>This action cannot be undone.</p>
                        <div style={styles.modalActions}>
                            <button onClick={() => setDeleteConfirm(null)} style={styles.cancelBtn}>Cancel</button>
                            <button onClick={confirmDelete} style={styles.confirmBtn}>Delete</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#111111',
        fontFamily: 'DM Sans, sans-serif',
        position: 'relative',
    },
    grain: {
        pointerEvents: 'none',
        position: 'fixed',
        inset: 0,
        opacity: 0.04,
        mixBlendMode: 'overlay',
        zIndex: 0,
        backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
    },
    loadingScreen: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111111',
    },
    loadingText: {
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        fontSize: 11,
        letterSpacing: '0.2em',
    },
    hero: {
        textAlign: 'center',
        padding: '64px 24px 48px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        position: 'relative',
        zIndex: 1,
    },
    heroKicker: {
        fontSize: 9,
        letterSpacing: '0.35em',
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        marginBottom: 16,
    },
    heroTitle: {
        fontFamily: 'Lora, serif',
        fontSize: 42,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.92)',
        marginBottom: 12,
        letterSpacing: '-0.5px',
    },
    heroSub: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.4)',
        marginBottom: 28,
        fontWeight: 300,
    },
    heroBtn: {
        display: 'inline-block',
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#111',
        padding: '10px 24px',
        fontSize: 11,
        fontWeight: 700,
        fontFamily: 'monospace',
        letterSpacing: '0.15em',
        textDecoration: 'none',
    },
    layout: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '48px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 280px',
        gap: '48px',
        alignItems: 'start',
        position: 'relative',
        zIndex: 1,
    },
    feed: {
        display: 'flex',
        flexDirection: 'column',
    },
    empty: { textAlign: 'center', padding: '80px 20px' },
    emptyTitle: {
        fontFamily: 'Lora, serif',
        fontSize: 24,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 8,
    },
    emptySub: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 14,
        marginBottom: 24,
    },
    card: {
        padding: '28px 0',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
    },
    cardFirst: { paddingTop: 0 },
    featuredBadge: {
        display: 'inline-block',
        fontSize: 9,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.2em',
        fontFamily: 'monospace',
        marginBottom: 12,
    },
    cardMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        marginBottom: 10,
    },
    author: {
        fontSize: 13,
        fontWeight: 500,
        color: 'rgba(255,255,255,0.55)',
        textDecoration: 'none',
    },
    dot: { color: 'rgba(255,255,255,0.2)', fontSize: 13 },
    date: { fontSize: 13, color: 'rgba(255,255,255,0.3)' },
    cardTitle: {
        fontFamily: 'Lora, serif',
        fontSize: 20,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.88)',
        marginBottom: 10,
        lineHeight: '1.4',
        letterSpacing: '-0.2px',
    },
    cardTitleLarge: {
        fontFamily: 'Lora, serif',
        fontSize: 28,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.92)',
        marginBottom: 12,
        lineHeight: '1.3',
        letterSpacing: '-0.4px',
    },
    excerpt: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.45)',
        lineHeight: '1.7',
        marginBottom: 16,
        fontWeight: 300,
    },
    cardFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    readMore: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        fontWeight: 500,
        textDecoration: 'none',
    },
    footerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    likeBtn: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.3)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        fontFamily: 'DM Sans, sans-serif',
    },
    likeBtnActive: { color: '#e0245e' },
    deleteBtn: {
        fontSize: 12,
        color: 'rgba(200,60,60,0.7)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        fontFamily: 'DM Sans, sans-serif',
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        position: 'sticky',
        top: 80,
    },
    sideCard: {
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '20px',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    sideTitle: {
        fontFamily: 'Lora, serif',
        fontSize: 15,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.75)',
        marginBottom: 10,
    },
    sideText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
        lineHeight: '1.6',
        marginBottom: 16,
        fontWeight: 300,
    },
    sideBtn: {
        display: 'inline-block',
        border: '1px solid rgba(255,255,255,0.2)',
        color: 'rgba(255,255,255,0.7)',
        padding: '7px 16px',
        fontSize: 11,
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        textDecoration: 'none',
    },
    statRow: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 0',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    statNum: {
        fontSize: 18,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.75)',
        minWidth: 40,
        fontFamily: 'Lora, serif',
    },
    statLabel: { fontSize: 13, color: 'rgba(255,255,255,0.35)' },
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
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
        fontSize: 20,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.88)',
        marginBottom: 8,
    },
    modalText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.4)',
        marginBottom: 24,
    },
    modalActions: {
        display: 'flex',
        gap: 12,
        justifyContent: 'flex-end',
    },
    cancelBtn: {
        padding: '8px 20px',
        backgroundColor: 'transparent',
        color: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.15)',
        cursor: 'pointer',
        fontSize: 12,
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
    },
    confirmBtn: {
        padding: '8px 20px',
        backgroundColor: 'rgba(180,30,30,0.8)',
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
        fontSize: 12,
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
    },
}

export default Posts