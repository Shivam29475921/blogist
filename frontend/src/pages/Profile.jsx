import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { authAPI, postAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'

function Profile() {
    const { username } = useParams()
    const { user } = useAuth()
    const navigate = useNavigate()

    const [profile, setProfile] = useState(null)
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [followData, setFollowData] = useState({ followers_count: 0, following_count: 0, is_following: false })
    const [followLoading, setFollowLoading] = useState(false)
    const [editing, setEditing] = useState(false)
    const [editBio, setEditBio] = useState('')
    const [editDisplayName, setEditDisplayName] = useState('')
    const [editLoading, setEditLoading] = useState(false)
    const [editError, setEditError] = useState('')

    useEffect(() => { fetchProfile(); fetchUserPosts(); fetchFollowStatus() }, [username])

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
        } catch (err) { console.error('Failed to load posts') }
    }

    const fetchFollowStatus = async () => {
        try {
            const response = await authAPI.followStatus(username)
            setFollowData(response.data)
        } catch (err) { console.error('Failed to load follow status') }
    }

    const handleFollow = async () => {
        if (!user) { navigate('/login'); return }
        setFollowLoading(true)
        try {
            const response = await authAPI.toggleFollow(username)
            setFollowData(prev => ({
                ...prev,
                is_following: response.data.following,
                followers_count: response.data.followers_count,
            }))
        } catch (err) { console.error('Failed to toggle follow') }
        finally { setFollowLoading(false) }
    }

    const handleEditSave = async () => {
        setEditLoading(true)
        setEditError('')
        try {
            const response = await authAPI.updateProfile({ bio: editBio, display_name: editDisplayName })
            setProfile(prev => ({ ...prev, bio: response.data.bio, display_name: response.data.display_name }))
            setEditing(false)
        } catch (err) {
            if (err.response?.status === 401) {
                setEditError('Session expired. Sign in again.')
            } else {
                const data = err.response?.data
                setEditError(data ? Object.values(data).flat().join(' ') : 'Failed to update profile.')
            }
        } finally { setEditLoading(false) }
    }

    const startEditing = () => {
        setEditBio(profile.bio || '')
        setEditDisplayName(profile.display_name || '')
        setEditing(true)
    }

    const handleLike = async (e, postId) => {
        e.preventDefault(); e.stopPropagation()
        if (!user) { navigate('/login'); return }
        try {
            const response = await postAPI.toggleLike(postId)
            setPosts(posts.map(p => p.id === postId
                ? { ...p, likes_count: response.data.likes_count, is_liked: response.data.liked }
                : p
            ))
        } catch (err) { console.error('Failed to toggle like') }
    }

    if (loading) return (
        <div style={styles.center}>
            <p style={styles.loadingText}>Loading...</p>
        </div>
    )
    if (error) return (
        <div style={styles.center}>
            <p style={styles.loadingText}>{error}</p>
        </div>
    )
    if (!profile) return null

    const isOwnProfile = user && user.username === username
    const joinDate = new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    return (
        <div style={styles.page}>
            <div aria-hidden style={styles.grain} />

            {/* Profile Header */}
            <div style={styles.headerWrap}>
                <div style={styles.headerInner}>
                    <div style={styles.backRow}><BackButton /></div>

                    {editing ? (
                        <div style={styles.editForm}>
                            {editError && <p style={styles.editError}>{editError}</p>}
                            <div style={styles.editField}>
                                <label style={styles.editLabel}>DISPLAY NAME</label>
                                <input
                                    value={editDisplayName}
                                    onChange={(e) => setEditDisplayName(e.target.value)}
                                    style={styles.editInput}
                                    placeholder="Display name"
                                />
                                <p style={styles.editHint}>Username @{profile.username} cannot be changed.</p>
                            </div>
                            <div style={styles.editField}>
                                <label style={styles.editLabel}>BIO</label>
                                <textarea
                                    value={editBio}
                                    onChange={(e) => setEditBio(e.target.value)}
                                    style={styles.editTextarea}
                                    placeholder="Tell the world about yourself..."
                                    rows={3}
                                />
                            </div>
                            <div style={styles.editActions}>
                                <button onClick={() => setEditing(false)} style={styles.editCancelBtn}>CANCEL</button>
                                <button onClick={handleEditSave} disabled={editLoading} style={styles.editSaveBtn}>
                                    {editLoading ? 'SAVING...' : 'SAVE →'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div style={styles.profileRow}>
                            <div style={styles.info}>
                                <h1 style={styles.name}>{profile.display_name || profile.username}</h1>
                                <p style={styles.handle}>@{profile.username}</p>
                                <p style={styles.bio}>{profile.bio || 'No bio yet.'}</p>
                                <div style={styles.stats}>
                                    <span style={styles.stat}><strong>{posts.length}</strong> posts</span>
                                    <span style={styles.statDot}>·</span>
                                    <span style={styles.stat}><strong>{followData.followers_count}</strong> followers</span>
                                    <span style={styles.statDot}>·</span>
                                    <span style={styles.stat}><strong>{followData.following_count}</strong> following</span>
                                </div>
                                <p style={styles.joined}>Member since {joinDate}</p>
                                <div style={styles.actions}>
                                    {isOwnProfile ? (
                                        <>
                                            <button onClick={startEditing} style={styles.editBtn}>Edit profile</button>
                                            <Link to="/posts/create" style={styles.writeBtn}>Write a post →</Link>
                                        </>
                                    ) : user ? (
                                        <button
                                            onClick={handleFollow}
                                            disabled={followLoading}
                                            style={followData.is_following ? styles.unfollowBtn : styles.followBtn}
                                        >
                                            {followLoading ? '...' : followData.is_following ? 'Following' : 'Follow'}
                                        </button>
                                    ) : (
                                        <Link to="/login" style={styles.followBtn}>Follow</Link>
                                    )}
                                </div>
                            </div>

                            <div style={styles.avatar}>
                                {username.charAt(0).toUpperCase()}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Posts Feed */}
            <div style={styles.layout}>
                <main>
                    <p style={styles.feedKicker}>
                        {isOwnProfile ? 'YOUR DISPATCHES' : `DISPATCHES BY @${username.toUpperCase()}`}
                    </p>
                    {posts.length === 0 ? (
                        <div style={styles.empty}>
                            <p style={styles.emptyText}>No posts yet.</p>
                            {isOwnProfile && (
                                <Link to="/posts/create" style={styles.emptyBtn}>Write your first post →</Link>
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
                                        style={{ ...styles.likeBtn, ...(post.is_liked ? styles.likeBtnActive : {}) }}
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
    center: {
        minHeight: '100vh',
        backgroundColor: '#111111',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        fontSize: 11,
        letterSpacing: '0.2em',
    },
    headerWrap: {
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        padding: '24px 24px 40px',
        position: 'relative',
        zIndex: 1,
    },
    headerInner: {
        maxWidth: '740px',
        margin: '0 auto',
    },
    backRow: { marginBottom: 24 },
    profileRow: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 32,
    },
    info: { flex: 1 },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.12)',
        color: 'rgba(255,255,255,0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 28,
        fontFamily: 'Lora, serif',
        fontWeight: 600,
        flexShrink: 0,
    },
    name: {
        fontFamily: 'Lora, serif',
        fontSize: 28,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.92)',
        marginBottom: 4,
        lineHeight: '1.2',
    },
    handle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.3)',
        marginBottom: 12,
    },
    bio: {
        fontSize: 15,
        color: 'rgba(255,255,255,0.55)',
        lineHeight: '1.6',
        marginBottom: 14,
        fontWeight: 300,
        maxWidth: 480,
    },
    stats: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 6,
    },
    stat: { fontSize: 13, color: 'rgba(255,255,255,0.45)' },
    statDot: { color: 'rgba(255,255,255,0.15)', fontSize: 13 },
    joined: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.2)',
        marginBottom: 20,
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
    },
    actions: { display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' },
    followBtn: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#111',
        border: 'none',
        padding: '9px 22px',
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'monospace',
        letterSpacing: '0.15em',
        textDecoration: 'none',
        display: 'inline-block',
    },
    unfollowBtn: {
        backgroundColor: 'transparent',
        color: 'rgba(255,255,255,0.55)',
        border: '1px solid rgba(255,255,255,0.15)',
        padding: '9px 22px',
        fontSize: 11,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: 'monospace',
        letterSpacing: '0.15em',
    },
    editBtn: {
        backgroundColor: 'transparent',
        color: 'rgba(255,255,255,0.5)',
        border: '1px solid rgba(255,255,255,0.15)',
        padding: '8px 18px',
        fontSize: 11,
        cursor: 'pointer',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
    },
    writeBtn: {
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#111',
        padding: '8px 18px',
        fontSize: 11,
        fontWeight: 700,
        textDecoration: 'none',
        display: 'inline-block',
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
    },
    editForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        maxWidth: 500,
    },
    editField: { display: 'flex', flexDirection: 'column', gap: 6 },
    editLabel: {
        fontSize: 9,
        letterSpacing: '0.25em',
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
    },
    editInput: {
        padding: '9px 12px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontFamily: 'DM Sans, sans-serif',
        outline: 'none',
        borderRadius: 0,
    },
    editHint: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.2)',
        margin: 0,
        fontFamily: 'monospace',
    },
    editTextarea: {
        padding: '9px 12px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        fontFamily: 'DM Sans, sans-serif',
        outline: 'none',
        resize: 'vertical',
        borderRadius: 0,
    },
    editActions: { display: 'flex', gap: 8 },
    editCancelBtn: {
        padding: '7px 16px',
        backgroundColor: 'transparent',
        color: 'rgba(255,255,255,0.4)',
        border: '1px solid rgba(255,255,255,0.12)',
        cursor: 'pointer',
        fontSize: 9,
        fontFamily: 'monospace',
        letterSpacing: '0.15em',
    },
    editSaveBtn: {
        padding: '7px 16px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#111',
        border: 'none',
        cursor: 'pointer',
        fontSize: 9,
        fontFamily: 'monospace',
        letterSpacing: '0.15em',
        fontWeight: 700,
    },
    editError: {
        fontSize: 12,
        color: 'rgba(220,80,80,0.8)',
        fontFamily: 'DM Sans, sans-serif',
    },
    layout: {
        maxWidth: '740px',
        margin: '0 auto',
        padding: '40px 24px',
        position: 'relative',
        zIndex: 1,
    },
    feedKicker: {
        fontSize: 9,
        letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottom: '1px solid rgba(255,255,255,0.07)',
    },
    empty: { textAlign: 'center', padding: '48px 0' },
    emptyText: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: 15,
        marginBottom: 16,
    },
    emptyBtn: {
        display: 'inline-block',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#111',
        padding: '8px 18px',
        fontSize: 11,
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
        fontWeight: 700,
        textDecoration: 'none',
    },
    card: {
        padding: '24px 0',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        cursor: 'pointer',
    },
    cardMeta: { marginBottom: 8 },
    date: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.25)',
        fontFamily: 'monospace',
        letterSpacing: '0.05em',
    },
    cardTitle: {
        fontFamily: 'Lora, serif',
        fontSize: 20,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.88)',
        marginBottom: 8,
        lineHeight: '1.4',
    },
    excerpt: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.4)',
        lineHeight: '1.7',
        marginBottom: 14,
        fontWeight: 300,
    },
    cardFooter: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    readMore: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: 500,
        textDecoration: 'none',
    },
    likeBtn: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.25)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: 0,
        fontFamily: 'DM Sans, sans-serif',
    },
    likeBtnActive: { color: '#e0245e' },
}

export default Profile