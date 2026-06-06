import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { postAPI, aiAPI } from '../api/axios'

function CreatePost() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [topic, setTopic] = useState('')
    const [loading, setLoading] = useState(false)
    const [aiLoading, setAiLoading] = useState(false)
    const [error, setError] = useState('')
    const textareaRef = useRef(null)
    const navigate = useNavigate()

    const insertFormat = (before, after = '') => {
        const textarea = textareaRef.current
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selected = content.substring(start, end)
        const newContent =
            content.substring(0, start) +
            before + selected + after +
            content.substring(end)
        setContent(newContent)
        setTimeout(() => {
            textarea.focus()
            textarea.selectionStart = start + before.length
            textarea.selectionEnd = end + before.length
        }, 0)
    }

    const toolbarButtons = [
        { label: 'B', title: 'Bold', action: () => insertFormat('**', '**'), style: { fontWeight: 'bold' } },
        { label: 'I', title: 'Italic', action: () => insertFormat('*', '*'), style: { fontStyle: 'italic' } },
        { label: 'H1', title: 'Heading 1', action: () => insertFormat('# '), style: {} },
        { label: 'H2', title: 'Heading 2', action: () => insertFormat('## '), style: {} },
        { label: '• List', title: 'Bullet List', action: () => insertFormat('- '), style: {} },
        { label: '1. List', title: 'Numbered List', action: () => insertFormat('1. '), style: {} },
        { label: '— Line', title: 'Divider', action: () => insertFormat('\n---\n'), style: {} },
        { label: '`Code`', title: 'Inline Code', action: () => insertFormat('`', '`'), style: { fontFamily: 'monospace' } },
    ]

    const handleGenerate = async () => {
        const trimmed = topic.trim()
        if (!trimmed) {
            setError('Enter a topic to generate content')
            return
        }
        setAiLoading(true)
        setError('')
        try {
            const response = await aiAPI.generateBlog(trimmed)
            if (response.data.content) {
                setContent(response.data.content)
                if (!title) setTitle(trimmed)
            } else {
                setError('AI returned no content. Try a different topic.')
            }
        } catch (err) {
            const status = err.response?.status
            if (status === 401) setError('Log in before generating AI content.')
            else if (!err.response) setError('AI service not reachable. Start ai-service on port 8004.')
            else setError('AI generation failed. Try again.')
        } finally {
            setAiLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) {
            setError('Title and content are required')
            return
        }
        setLoading(true)
        setError('')
        try {
            const response = await postAPI.createPost({ title, content })
            navigate(`/posts/${response.data.id}`)
        } catch (err) {
            const status = err.response?.status
            if (status === 401) setError('Log in before publishing.')
            else if (!err.response) setError('Post service not reachable. Start post-service on port 8002.')
            else setError('Failed to create post. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Write a Post</h1>

            {error && <div style={styles.error}>{error}</div>}

            {/* AI Generator */}
            <div style={styles.aiSection}>
                <p style={styles.aiLabel}>Generate with AI</p>
                <div style={styles.aiRow}>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter a topic e.g. Future of Kubernetes"
                        style={styles.aiInput}
                    />
                    <button
                        onClick={handleGenerate}
                        style={aiLoading ? styles.aiButtonDisabled : styles.aiButton}
                        disabled={aiLoading}
                    >
                        {aiLoading ? 'Generating...' : 'Generate'}
                    </button>
                </div>
            </div>

            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.field}>
                    <label style={styles.label}>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Post title"
                        style={styles.input}
                        required
                    />
                </div>

                <div style={styles.field}>
                    <label style={styles.label}>Content</label>

                    {/* Toolbar */}
                    <div style={styles.toolbar}>
                        {toolbarButtons.map((btn) => (
                            <button
                                key={btn.label}
                                type="button"
                                title={btn.title}
                                onClick={btn.action}
                                style={{ ...styles.toolbarBtn, ...btn.style }}
                            >
                                {btn.label}
                            </button>
                        ))}
                    </div>

                    <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your post here or generate with AI above..."
                        style={styles.textarea}
                        rows={18}
                        required
                    />
                    <p style={styles.hint}>
                        Supports Markdown — **bold**, *italic*, # Heading, - list
                    </p>
                </div>

                <div style={styles.actions}>
                    <button
                        type="button"
                        onClick={() => navigate('/posts')}
                        style={styles.cancelButton}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        style={loading ? styles.buttonDisabled : styles.button}
                        disabled={loading}
                    >
                        {loading ? 'Publishing...' : 'Publish Post'}
                    </button>
                </div>
            </form>
        </div>
    )
}

const styles = {
    container: { maxWidth: '800px', margin: '0 auto', padding: '40px 20px' },
    title: { fontSize: '28px', fontWeight: 'bold', color: '#111', marginBottom: '24px' },
    error: {
        backgroundColor: '#fff0f0', color: '#cc0000',
        padding: '10px 14px', borderRadius: '4px',
        marginBottom: '16px', fontSize: '14px',
    },
    aiSection: {
        backgroundColor: '#f8f8ff', border: '1px solid #e0e0ff',
        borderRadius: '8px', padding: '20px', marginBottom: '28px',
    },
    aiLabel: { fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '10px' },
    aiRow: { display: 'flex', gap: '10px' },
    aiInput: {
        flex: 1, padding: '10px 14px', border: '1px solid #ddd',
        borderRadius: '4px', fontSize: '14px', outline: 'none',
    },
    aiButton: {
        padding: '10px 20px', backgroundColor: '#5b5bd6', color: '#fff',
        border: 'none', borderRadius: '4px', cursor: 'pointer',
        fontSize: '14px', whiteSpace: 'nowrap',
    },
    aiButtonDisabled: {
        padding: '10px 20px', backgroundColor: '#aaa', color: '#fff',
        border: 'none', borderRadius: '4px', cursor: 'not-allowed',
        fontSize: '14px', whiteSpace: 'nowrap',
    },
    form: { display: 'flex', flexDirection: 'column', gap: '20px' },
    field: { display: 'flex', flexDirection: 'column', gap: '6px' },
    label: { fontSize: '13px', fontWeight: '500', color: '#444' },
    input: {
        padding: '10px 14px', border: '1px solid #ddd',
        borderRadius: '4px', fontSize: '14px', outline: 'none',
    },
    toolbar: {
        display: 'flex', flexWrap: 'wrap', gap: '6px',
        padding: '8px', backgroundColor: '#f5f5f5',
        border: '1px solid #ddd', borderBottom: 'none',
        borderRadius: '4px 4px 0 0',
    },
    toolbarBtn: {
        padding: '4px 10px', backgroundColor: '#fff',
        border: '1px solid #ddd', borderRadius: '3px',
        cursor: 'pointer', fontSize: '13px', color: '#333',
    },
    textarea: {
        padding: '10px 14px', border: '1px solid #ddd',
        borderTop: 'none', borderRadius: '0 0 4px 4px',
        fontSize: '14px', outline: 'none',
        resize: 'vertical', fontFamily: 'monospace', lineHeight: '1.6',
    },
    hint: { fontSize: '12px', color: '#aaa', marginTop: '4px' },
    actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
    cancelButton: {
        padding: '10px 20px', backgroundColor: '#fff', color: '#444',
        border: '1px solid #ddd', borderRadius: '4px',
        cursor: 'pointer', fontSize: '14px',
    },
    button: {
        padding: '10px 24px', backgroundColor: '#111', color: '#fff',
        border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px',
    },
    buttonDisabled: {
        padding: '10px 24px', backgroundColor: '#888', color: '#fff',
        border: 'none', borderRadius: '4px', cursor: 'not-allowed', fontSize: '14px',
    },
}

export default CreatePost