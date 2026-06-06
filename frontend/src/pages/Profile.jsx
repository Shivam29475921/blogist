import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { authAPI, postAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Profile() {
    const { username } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        fetchProfile()
        fetchUserPosts()
    }, [username])

    const fetchProfile = async () => {
        try {
            const response = await authAPI.publicProfile(username)
            setProfile(response.data)
        } catch (err) {
            setError('User not found.')
        } finally {
            setLoading(false)
        }
    }

    const fetchUserPosts = async () => {
        try {
            const response = await postAPI.getPostsByAuthor(username)
            setPosts(response.data)
        } catch (err) {
            console.error('Failed to load posts')
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

    if (loading) return <div style={styles.center}>Loading...</div>
    if (error) return <div style={styles.center}>{error}</div>
    if (!profile) return null

    const isOwnProfile = user && user.username === username
    const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', {
        month: 'long', year: 'numeric'
    })

    return (
        <div style={styles.page}>
            {/* Profile Header */}
            <div style={styles.header}>
                <div style={styles.headerInner}>
                    <div style={styles.avatar}>
                        {username.charAt(0).toUpperCase()}
                    </div>
                    <div style={styles.info}>
                        <h1 style={styles.name}>@{profile.username}</h1>
                        <p style={styles.bio}>
                            {profile.bio || 'No bio yet.'}
                        </p>
                        <p style={styles.joined}>Joined {joinDate}</p>
                        <div style={styles.stats}>
                            <span style={styles.stat}>
                                <strong>{posts.length}</strong> posts
                            </span>
                        </div>
                    </div>
                    {isOwnProfile && (
                        <Link to="/posts/create" style={styles.writeBtn}>
                            Write a post
                        </Link>
                    )}
                </div>
            </div>

            {/* Posts */}
            <div style={styles.layout}>
                <main style={styles.feed}>
                    <h2 style={styles.feedTitle}>
                        {isOwnProfile ? 'Your posts' : `Posts by @${username}`}
                    </h2>

                    {posts.length === 0 ? (
                        <div style={styles.empty}>
                            <p style={styles.emptyText}>No posts yet.</p>
                            {isOwnProfile && (
                                <Link to="/posts/create" style={styles.emptyBtn}>
                                    Write your first post
                                </Link>
                            )}
                        </div>
                    ) : (
                        posts.map(post => (
                            <article
                                key={post.id}
                                style={styles.card}
                                onClick={() => navigate(`/posts/${post.id}`)}
                            >
                                <div style={styles.cardMeta}>
                                    <span style={styles.date}>
                                        {new Date(post.created_at).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric', year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <h3 style={styles.cardTitle}>{post.title}</h3>
                                <p style={styles.excerpt}>
                                    {post.content.replace(/[#*`]/g, '').substring(0, 160)}
                                    {post.content.length > 160 ? '...' : ''}
                                </p>
                                <div style={styles.cardFooter}>
                                    <Link
                                        to={`/posts/${post.id}`}
                                        style={styles.readMore}
                                        onClick={e => e.stopPropagation()}
                                    >
                                        Read more →
                                    </Link>
                                    <button
                                        onClick={(e) => handleLike(e, post.id)}
                                        style={{
                                            ...styles.likeBtn,
                                            ...(post.is_liked ? styles.likeBtnActive : {})
                                        }}
                                    >
                                        {post.is_liked ? '♥' : '♡'} {post.likes_count || 0}
                                    </button>
                                </div>
                            </article>
                        ))
                    )}
                </main>
            </div>
        </div>
    )
}

const styles = {
    page: { minHeight: '100vh', backgroundColor: '#faf9f7' },
    center: {
        textAlign: 'center',
        padding: '80px 20px',
        color: '#888',
    },
    header: {
        backgroundColor: '#fff',
        borderBottom: '1px solid #e8e4de',
        padding: '48px 24px',
    },
    headerInner: {
        maxWidth: '800px',
        margin: '0 auto',
        display: 'flex',
        gap: '28px',
        alignItems: 'flex-start',
    },
    avatar: {
        width: '72px',
        height: '72px',
        borderRadius: '50%',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontFamily: 'Lora, serif',
        fontWeight: '600',
        flexShrink: 0,
    },
    info: { flex: 1 },
    name: {
        fontFamily: 'Lora, serif',
        fontSize: '26px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '8px',
    },
    bio: {
        fontSize: '15px',
        color: '#666',
        lineHeight: '1.6',
        marginBottom: '8px',
        fontWeight: '300',
    },
    joined: {
        fontSize: '13px',
        color: '#aaa',
        marginBottom: '12px',
    },
    stats: {
        display: 'flex',
        gap: '20px',
    },
    stat: {
        fontSize: '13px',
        color: '#666',
    },
    writeBtn: {
        display: 'inline-block',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '8px 18px',
        borderRadius: '20px',
        fontSize: '13px',
        fontWeight: '500',
        whiteSpace: 'nowrap',
    },
    layout: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 24px',
    },
    feed: {},
    feedTitle: {
        fontFamily: 'Lora, serif',
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #e8e4de',
    },
    empty: {
        textAlign: 'center',
        padding: '48px 0',
    },
    emptyText: {
        color: '#aaa',
        fontSize: '15px',
        marginBottom: '16px',
    },
    emptyBtn: {
        display: 'inline-block',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '8px 18px',
        borderRadius: '20px',
        fontSize: '13px',
    },
    card: {
        padding: '24px 0',
        borderBottom: '1px solid #e8e4de',
        cursor: 'pointer',
    },
    cardMeta: {
        marginBottom: '8px',
    },
    date: { fontSize: '12px', color: '#aaa' },
    cardTitle: {
        fontFamily: 'Lora, serif',
        fontSize: '20px',
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: '8px',
        lineHeight: '1.4',
    },
    excerpt: {
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.7',
        marginBottom: '14px',
        fontWeight: '300',
    },
    cardFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    readMore: {
        fontSize: '13px',
        color: '#1a1a1a',
        fontWeight: '500',
    },
    likeBtn: {
        fontSize: '13px',
        color: '#aaa',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: '0',
        fontFamily: 'DM Sans, sans-serif',
    },
    likeBtnActive: { color: '#e0245e' },
}

export default Profile