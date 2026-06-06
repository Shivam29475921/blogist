import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { postAPI, commentAPI } from '../api/axios'
import { useAuth } from '../context/AuthContext'
import ReactMarkdown from 'react-markdown'


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

    useEffect(() => {
        fetchPost()
        fetchComments()
    }, [id])

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

    const handleDelete = async () => {
        if (!window.confirm('Delete this post?')) return
        try {
            await postAPI.deletePost(id)
            navigate('/posts')
        } catch (err) {
            alert('Failed to delete post.')
        }
    }

    if (loading) return <div style={styles.center}>Loading...</div>
    if (error) return <div style={styles.center}>{error}</div>
    if (!post) return null

    return (
        <div style={styles.container}>
            {/* Post */}
            <div style={styles.post}>
                <div style={styles.postHeader}>
                    <h1 style={styles.title}>{post.title}</h1>
                    <div style={styles.meta}>
                        <span>@{post.author_username}</span>
                        <span>{new Date(post.created_at).toLocaleDateString()}</span>
                        {user && user.id === post.author_id && (
                            <button onClick={handleDelete} style={styles.deleteButton}>
                                Delete Post
                            </button>
                        )}
                    </div>
                </div>
                <div style={styles.content}><ReactMarkdown>{post.content}</ReactMarkdown></div>
            </div>

            {/* Comments */}
            <div style={styles.commentsSection}>
                <h3 style={styles.commentsTitle}>
                    Comments ({comments.length})
                </h3>

                {/* Add Comment */}
                {user ? (
                    <form onSubmit={handleAddComment} style={styles.commentForm}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            style={styles.textarea}
                            rows={3}
                        />
                        <button
                            type="submit"
                            style={commentLoading ? styles.buttonDisabled : styles.button}
                            disabled={commentLoading}
                        >
                            {commentLoading ? 'Posting...' : 'Post Comment'}
                        </button>
                    </form>
                ) : (
                    <p style={styles.loginPrompt}>
                        <a href="/login" style={styles.link}>Login</a> to leave a comment
                    </p>
                )}

                {/* Comments List */}
                <div style={styles.commentsList}>
                    {comments.length === 0 ? (
                        <p style={styles.noComments}>No comments yet. Be the first!</p>
                    ) : (
                        comments.map(comment => (
                            <div key={comment.id} style={styles.comment}>
                                <div style={styles.commentHeader}>
                                    <span style={styles.commentAuthor}>
                                        @{comment.author_username}
                                    </span>
                                    <span style={styles.commentDate}>
                                        {new Date(comment.created_at).toLocaleDateString()}
                                    </span>
                                </div>
                                <p style={styles.commentContent}>{comment.content}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px 20px',
    },
    center: {
        textAlign: 'center',
        padding: '80px 20px',
        color: '#888',
    },
    post: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        marginBottom: '32px',
    },
    postHeader: {
        marginBottom: '24px',
        paddingBottom: '16px',
        borderBottom: '1px solid #f0f0f0',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#111',
        marginBottom: '12px',
    },
    meta: {
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        color: '#888',
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
    },
    content: {
        color: '#333',
        lineHeight: '1.8',
        fontSize: '16px',
        whiteSpace: 'pre-wrap',
    },
    commentsSection: {
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
    commentsTitle: {
        fontSize: '18px',
        fontWeight: '600',
        marginBottom: '20px',
        color: '#111',
    },
    commentForm: {
        marginBottom: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
    },
    textarea: {
        padding: '10px 14px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        resize: 'vertical',
        outline: 'none',
        fontFamily: 'sans-serif',
    },
    button: {
        alignSelf: 'flex-end',
        padding: '8px 20px',
        backgroundColor: '#111',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '13px',
    },
    buttonDisabled: {
        alignSelf: 'flex-end',
        padding: '8px 20px',
        backgroundColor: '#888',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'not-allowed',
        fontSize: '13px',
    },
    loginPrompt: {
        color: '#888',
        fontSize: '14px',
        marginBottom: '20px',
    },
    link: {
        color: '#111',
        fontWeight: '500',
    },
    commentsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    noComments: {
        color: '#aaa',
        fontSize: '14px',
        textAlign: 'center',
        padding: '20px 0',
    },
    comment: {
        padding: '16px',
        backgroundColor: '#f9f9f9',
        borderRadius: '6px',
    },
    commentHeader: {
        display: 'flex',
        gap: '12px',
        marginBottom: '8px',
        alignItems: 'center',
    },
    commentAuthor: {
        fontWeight: '500',
        fontSize: '13px',
        color: '#444',
    },
    commentDate: {
        color: '#aaa',
        fontSize: '12px',
    },
    commentContent: {
        color: '#555',
        fontSize: '14px',
        lineHeight: '1.6',
    },
}

export default PostDetail