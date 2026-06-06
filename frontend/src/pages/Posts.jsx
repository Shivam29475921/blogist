import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { postAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'

function Posts() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { user } = useAuth()

    useEffect(() => {
        fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
            const response = await postAPI.getPosts()
            setPosts(response.data)
        } catch (err) {
            setError('Failed to load posts.')
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (postId) => {
        if (!window.confirm('Delete this post?')) return
        try {
            await postAPI.deletePost(postId)
            setPosts(posts.filter(p => p.id !== postId))
        } catch (err) {
            alert('Failed to delete post.')
        }
    }

    if (loading) return <div style={styles.center}>Loading posts...</div>
    if (error) return <div style={styles.center}>{error}</div>

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Latest Posts</h1>
                {user && (
                    <Link to="/posts/create" style={styles.writeButton}>
                        + Write
                    </Link>
                )}
            </div>

            {posts.length === 0 ? (
                <div style={styles.empty}>
                    <p>No posts yet.</p>
                    {user && <Link to="/posts/create" style={styles.link}>Be the first to write one</Link>}
                </div>
            ) : (
                <div style={styles.grid}>
                    {posts.map(post => (
                        <div key={post.id} style={styles.card}>
                            <Link to={`/posts/${post.id}`} style={styles.cardLink}>
                                <h2 style={styles.postTitle}>{post.title}</h2>
                                <p style={styles.excerpt}>
                                    {post.content.length > 150
                                        ? post.content.substring(0, 150) + '...'
                                        : post.content}
                                </p>
                            </Link>
                            <div style={styles.cardFooter}>
                                <span style={styles.author}>@{post.author_username}</span>
                                <span style={styles.date}>
                                    {new Date(post.created_at).toLocaleDateString()}
                                </span>
                                {user && user.id === post.author_id && (
                                    <button
                                        onClick={() => handleDelete(post.id)}
                                        style={styles.deleteButton}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#111',
    },
    writeButton: {
        backgroundColor: '#111',
        color: '#fff',
        padding: '8px 16px',
        borderRadius: '4px',
        textDecoration: 'none',
        fontSize: '14px',
    },
    center: {
        textAlign: 'center',
        padding: '80px 20px',
        color: '#888',
    },
    empty: {
        textAlign: 'center',
        padding: '60px 20px',
        color: '#888',
    },
    link: {
        color: '#111',
        marginTop: '10px',
        display: 'inline-block',
    },
    grid: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    cardLink: {
        textDecoration: 'none',
        color: 'inherit',
    },
    postTitle: {
        fontSize: '20px',
        fontWeight: '600',
        marginBottom: '10px',
        color: '#111',
    },
    excerpt: {
        color: '#555',
        lineHeight: '1.6',
        fontSize: '14px',
        marginBottom: '16px',
    },
    cardFooter: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        borderTop: '1px solid #f0f0f0',
        paddingTop: '12px',
    },
    author: {
        color: '#888',
        fontSize: '13px',
    },
    date: {
        color: '#aaa',
        fontSize: '13px',
    },
    deleteButton: {
        marginLeft: 'auto',
        background: 'none',
        border: '1px solid #ffcccc',
        color: '#cc0000',
        padding: '4px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
    }
}

export default Posts