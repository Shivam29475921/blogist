import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { postAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Posts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        fetchPosts()
    }, [])

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
        if (!window.confirm('Delete this post?')) return
        try {
            await postAPI.deletePost(postId)
            setPosts(posts.filter(p => p.id !== postId))
        } catch (err) {
            alert('Failed to delete.')
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
            <div style={styles.loadingDot} />
        </div>
    )

    return (
        <div style={styles.page}>
            {/* Hero */}
            <div style={styles.hero}>
                <h1 style={styles.heroTitle}>Ideas worth reading</h1>
                <p style={styles.heroSub}>
                    Thoughtful writing from the Folio community
                </p>
                {user && (
                    <Link to="/posts/create" style={styles.heroBtn}>
                        Start writing
                    </Link>
                )}
            </div>

            {/* Feed */}
            <div style={styles.layout}>
                {/* Main Feed */}
                <main style={styles.feed}>
                    {posts.length === 0 ? (
                        <div style={styles.empty}>
                            <p style={styles.emptyTitle}>Nothing here yet</p>
                            <p style={styles.emptySub}>Be the first to publish on Folio</p>
                            {user && (
                                <Link to="/posts/create" style={styles.emptyBtn}>
                                    Write the first post
                                </Link>
                            )}
                        </div>
                    ) : (
                        posts.map((post, index) => (
                            <article
                                key={post.id}
                                style={{
                                    ...styles.card,
                                    ...(index === 0 ? styles.cardFirst : {})
                                }}
                                onClick={() => navigate(`/posts/${post.id}`)}
                            >
                                {index === 0 && (
                                    <span style={styles.featuredBadge}>Featured</span>
                                )}
                                <div style={styles.cardMeta}>
                                    <span style={styles.author}>@{post.author_username}</span>
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
                                            style={{
                                                ...styles.likeBtn,
                                                ...(post.is_liked ? styles.likeBtnActive : {})
                                            }}
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
                            <Link to="/posts/create" style={styles.sideBtn}>
                                Write a post
                            </Link>
                        ) : (
                            <Link to="/register" style={styles.sideBtn}>
                                Join Folio
                            </Link>
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
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh' },
    loadingScreen: {
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingDot: {
        width: '8px',
        height: '8px',
        borderRadius: '50%',
        backgroundColor: '#1a1a1a',
    },
    hero: {
        textAlign: 'center',
        padding: '64px 24px 48px',
        borderBottom: '1px solid #e8e4de',
        backgroundColor: '#fff',
    },
    heroTitle: {
        fontFamily: 'Lora, serif',
        fontSize: '42px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '12px',
        letterSpacing: '-0.5px',
    },
    heroSub: {
        fontSize: '16px',
        color: '#888',
        marginBottom: '28px',
        fontWeight: '300',
    },
    heroBtn: {
        display: 'inline-block',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '10px 24px',
        borderRadius: '24px',
        fontSize: '14px',
        fontWeight: '500',
    },
    layout: {
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '48px 24px',
        display: 'grid',
        gridTemplateColumns: '1fr 300px',
        gap: '48px',
        alignItems: 'start',
    },
    feed: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0',
    },
    empty: { textAlign: 'center', padding: '80px 20px' },
    emptyTitle: {
        fontFamily: 'Lora, serif',
        fontSize: '24px',
        color: '#1a1a1a',
        marginBottom: '8px',
    },
    emptySub: { color: '#888', fontSize: '14px', marginBottom: '24px' },
    emptyBtn: {
        display: 'inline-block',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '14px',
    },
    card: {
        padding: '28px 0',
        borderBottom: '1px solid #e8e4de',
        cursor: 'pointer',
    },
    cardFirst: { paddingTop: '0' },
    featuredBadge: {
        display: 'inline-block',
        fontSize: '11px',
        fontWeight: '600',
        color: '#888',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        marginBottom: '12px',
    },
    cardMeta: {
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        marginBottom: '10px',
    },
    author: { fontSize: '13px', fontWeight: '500', color: '#444' },
    dot: { color: '#bbb', fontSize: '13px' },
    date: { fontSize: '13px', color: '#aaa' },
    cardTitle: {
        fontFamily: 'Lora, serif',
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '10px',
        lineHeight: '1.4',
        letterSpacing: '-0.2px',
    },
    cardTitleLarge: {
        fontFamily: 'Lora, serif',
        fontSize: '28px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '12px',
        lineHeight: '1.3',
        letterSpacing: '-0.4px',
    },
    excerpt: {
        fontSize: '15px',
        color: '#666',
        lineHeight: '1.7',
        marginBottom: '16px',
        fontWeight: '300',
    },
    cardFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    readMore: { fontSize: '13px', color: '#1a1a1a', fontWeight: '500' },
    footerRight: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    likeBtn: {
        fontSize: '14px',
        color: '#aaa',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        fontFamily: 'DM Sans, sans-serif',
    },
    likeBtnActive: {
        color: '#e0245e',
    },
    deleteBtn: {
        fontSize: '12px',
        color: '#cc0000',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        fontFamily: 'DM Sans, sans-serif',
    },
    sidebar: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'sticky',
        top: '80px',
    },
    sideCard: {
        backgroundColor: '#fff',
        border: '1px solid #e8e4de',
        borderRadius: '8px',
        padding: '20px',
    },
    sideTitle: {
        fontFamily: 'Lora, serif',
        fontSize: '16px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '10px',
    },
    sideText: {
        fontSize: '13px',
        color: '#666',
        lineHeight: '1.6',
        marginBottom: '16px',
        fontWeight: '300',
    },
    sideBtn: {
        display: 'inline-block',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
    },
    statRow: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px 0',
        borderBottom: '1px solid #f0ece6',
    },
    statNum: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#1a1a1a',
        minWidth: '40px',
        fontFamily: 'Lora, serif',
    },
    statLabel: { fontSize: '13px', color: '#888' },
}

export default Posts