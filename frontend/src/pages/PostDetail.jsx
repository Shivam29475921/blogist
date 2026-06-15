import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { postAPI, commentAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import BackButton from '../components/BackButton'

function PostDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = useAuth()

    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [newComment, setNewComment] = useState('')
    const [loading, setLoading] = useState(true)
    const [commentLoading, setCommentLoading] = useState(false)
    const [error, setError] = useState('')
    const [deleteConfirm, setDeleteConfirm] = useState(false)

    useEffect(() => { fetchPost(); fetchComments() }, [id])

    const fetchPost = async () => {
        try {
            const response = await postAPI.getPost(id)
            setPost(response.data)
        } catch (err) {
            setError('Post not found.')
        } finally {
            setLoading(false)
        }
    }

    const fetchComments = async () => {
        try {
            const response = await commentAPI.getComments(id)
            setComments(response.data)
        } catch (err) {
            console.error('Failed to load comments')
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if (!newComment.trim()) return
        setCommentLoading(true)
        try {
            const response = await commentAPI.addComment({
                post_id: parseInt(id),
                post_author_id: post.author_id,
                content: newComment
            })
            setComments([response.data, ...comments])
            setNewComment('')
        } catch (err) {
            alert('Failed to add comment. Make sure you are logged in.')
        } finally {
            setCommentLoading(false)
        }
    }

    const confirmDelete = async () => {
        try {
            await postAPI.deletePost(id)
            navigate('/posts')
        } catch (err) {
            alert('Failed to delete post.')
        } finally {
            setDeleteConfirm(false)
        }
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
    if (!post) return null

    return (
        <div style={styles.page}>
            {/* Film grain */}
            <div aria-hidden style={styles.grain} />

            <div style={styles.container}>
                <BackButton />

                {/* Post */}
                <div style={styles.post}>
                    <div style={styles.postHeader}>
                        <h1 style={styles.title}>{post.title}</h1>
                        <div style={styles.meta}>
                            <Link to={`/profile/${post.author_username}`} style={styles.metaAuthor}>
                                @{post.author_username}
                            </Link>
                            <span style={styles.metaDot}>·</span>
                            <span style={styles.metaDate}>
                                {new Date(post.created_at).toLocaleDateString('en-US', {
                                    month: 'long', day: 'numeric', year: 'numeric'
                                })}
                            </span>
                            {user && user.id === post.author_id && (
                                <button onClick={() => setDeleteConfirm(true)} style={styles.deleteButton}>
                                    Delete
                                </button>
                            )}
                        </div>
                    </div>
                    <div style={styles.content}>
                        <ReactMarkdown>{post.content}</ReactMarkdown>
                    </div>
                </div>

                {/* Comments */}
                <div style={styles.commentsSection}>
                    <p style={styles.commentsKicker}>RESPONSES · {comments.length}</p>

                    {user ? (
                        <form onSubmit={handleAddComment} style={styles.commentForm}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a response..."
                                style={styles.textarea}
                                rows={3}
                            />
                            <button
                                type="submit"
                                style={commentLoading ? styles.buttonDisabled : styles.button}
                                disabled={commentLoading}
                            >
                                {commentLoading ? 'POSTING...' : 'POST →'}
                            </button>
                        </form>
                    ) : (
                        <p style={styles.loginPrompt}>
                            <Link to="/login" style={styles.loginLink}>Sign in</Link>
                            {' '}to leave a response
                        </p>
                    )}

                    <div style={styles.commentsList}>
                        {comments.length === 0 ? (
                            <p style={styles.noComments}>No responses yet. Be the first.</p>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} style={styles.comment}>
                                    <div style={styles.commentHeader}>
                                        <span style={styles.commentAuthor}>@{comment.author_username}</span>
                                        <span style={styles.commentDate}>
                                            {new Date(comment.created_at).toLocaleDateString('en-US', {
                                                month: 'short', day: 'numeric'
                                            })}
                                        </span>
                                    </div>
                                    <p style={styles.commentContent}>{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {deleteConfirm && (
                <div style={styles.overlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Delete post?</h3>
                        <p style={styles.modalText}>This action cannot be undone.</p>
                        <div style={styles.modalActions}>
                            <button onClick={() => setDeleteConfirm(false)} style={styles.cancelBtn}>Cancel</button>
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
    container: {
        maxWidth: '780px',
        margin: '0 auto',
        padding: '40px 24px',
        position: 'relative',
        zIndex: 1,
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
    post: {
        marginBottom: 48,
        paddingBottom: 48,
        borderBottom: '1px solid rgba(255,255,255,0.08)',
    },
    postHeader: {
        marginBottom: 32,
        paddingBottom: 20,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    title: {
        fontFamily: 'Lora, serif',
        fontSize: 32,
        fontWeight: 600,
        color: 'rgba(255,255,255,0.92)',
        marginBottom: 16,
        lineHeight: '1.3',
        letterSpacing: '-0.3px',
    },
    meta: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
    },
    metaAuthor: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.45)',
        textDecoration: 'none',
        fontWeight: 500,
    },
    metaDot: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 13,
    },
    metaDate: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.3)',
    },
    deleteButton: {
        marginLeft: 'auto',
        background: 'none',
        border: '1px solid rgba(200,60,60,0.3)',
        color: 'rgba(200,80,80,0.7)',
        padding: '4px 10px',
        cursor: 'pointer',
        fontSize: 11,
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
    },
    content: {
        color: 'rgba(255,255,255,0.72)',
        lineHeight: '1.9',
        fontSize: 16,
        fontFamily: 'DM Sans, sans-serif',
    },
    commentsSection: {
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
    },
    commentsKicker: {
        fontSize: 9,
        letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        marginBottom: 4,
    },
    commentForm: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
    },
    textarea: {
        padding: '12px 14px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.8)',
        fontSize: 14,
        resize: 'vertical',
        outline: 'none',
        fontFamily: 'DM Sans, sans-serif',
        lineHeight: '1.6',
        borderRadius: 0,
    },
    button: {
        alignSelf: 'flex-end',
        padding: '8px 20px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#111',
        border: 'none',
        cursor: 'pointer',
        fontSize: 9,
        fontFamily: 'monospace',
        letterSpacing: '0.2em',
        fontWeight: 700,
    },
    buttonDisabled: {
        alignSelf: 'flex-end',
        padding: '8px 20px',
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,0.3)',
        border: 'none',
        cursor: 'not-allowed',
        fontSize: 9,
        fontFamily: 'monospace',
        letterSpacing: '0.2em',
    },
    loginPrompt: {
        color: 'rgba(255,255,255,0.3)',
        fontSize: 13,
        fontFamily: 'DM Sans, sans-serif',
    },
    loginLink: {
        color: 'rgba(255,255,255,0.6)',
        textDecoration: 'underline',
        textUnderlineOffset: 3,
    },
    commentsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
    },
    noComments: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 13,
        fontFamily: 'DM Sans, sans-serif',
        padding: '24px 0',
    },
    comment: {
        padding: '20px 0',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
    },
    commentHeader: {
        display: 'flex',
        gap: 10,
        marginBottom: 8,
        alignItems: 'center',
    },
    commentAuthor: {
        fontWeight: 500,
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
    },
    commentDate: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 12,
    },
    commentContent: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
        lineHeight: '1.7',
        margin: 0,
    },
    overlay: {
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
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
        fontFamily: 'DM Sans, sans-serif',
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

export default PostDetail