import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { postAPI, aiAPI } from '../api/axios'
import BackButton from '../components/BackButton'
import ReactMarkdown from 'react-markdown'

function CreatePost() {
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [topic, setTopic] = useState('')
    const [aiContent, setAiContent] = useState('')
    const [aiTitle, setAiTitle] = useState('')
    const [showAiPanel, setShowAiPanel] = useState(false)
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
        if (!trimmed) { setError('Enter a topic to research'); return }
        setAiLoading(true)
        setError('')
        try {
            const response = await aiAPI.generateBlog(trimmed)
            if (response.data.content) {
                setAiContent(response.data.content)
                setAiTitle(trimmed)
                setShowAiPanel(true)
                if (!title) setTitle(trimmed)
            } else {
                setError('AI returned no content. Try a different topic.')
            }
        } catch (err) {
            const status = err.response?.status
            if (status === 401) setError('Log in before generating AI content.')
            else if (!err.response) setError('AI service not reachable.')
            else setError('AI generation failed. Try again.')
        } finally {
            setAiLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!title.trim() || !content.trim()) { setError('Title and content are required'); return }
        setLoading(true)
        setError('')
        try {
            const response = await postAPI.createPost({ title, content })
            navigate(`/posts/${response.data.id}`)
        } catch (err) {
            const status = err.response?.status
            if (status === 401) setError('Log in before publishing.')
            else if (!err.response) setError('Post service not reachable.')
            else setError('Failed to create post. Try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.page}>
            <div aria-hidden style={styles.grain} />

            <div style={styles.topBar}>
                <div style={styles.masthead}>
                    <span style={styles.mastheadTitle}>Folio</span>
                    <span style={styles.mastheadSub}> · new dispatch</span>
                </div>
                <div style={styles.topBarRight}>
                    <button type="button" onClick={() => navigate('/posts')} style={styles.cancelButton}>
                        DISCARD
                    </button>
                    <button onClick={handleSubmit} style={loading ? styles.buttonDisabled : styles.button} disabled={loading}>
                        {loading ? 'PUBLISHING...' : 'PUBLISH →'}
                    </button>
                </div>
            </div>

            <div style={styles.divider} />

            {error && <div style={styles.error}>{error}</div>}

            <div style={styles.workspace}>
                {/* Left — writing panel */}
                <div style={styles.writePanel}>
                    <p style={styles.panelLabel}>YOUR DISPATCH</p>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Headline"
                        style={styles.titleInput}
                    />

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
                        placeholder="Write your dispatch here. Use the AI Research panel to gather facts, then write in your own words..."
                        style={styles.textarea}
                        required
                    />
                    <p style={styles.hint}>
                        MARKDOWN SUPPORTED · **bold** · *italic* · # Heading · - list
                    </p>
                </div>

                {/* Right — AI research panel */}
                <div style={styles.aiPanel}>
                    <p style={styles.panelLabel}>AI RESEARCH DESK</p>
                    <p style={styles.aiDesc}>
                        Research any topic. Read the facts, then write in your own voice.
                    </p>

                    <div style={styles.aiRow}>
                        <input
                            type="text"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                            placeholder="e.g. History of the printing press"
                            style={styles.aiInput}
                        />
                        <button
                            onClick={handleGenerate}
                            style={aiLoading ? styles.aiButtonDisabled : styles.aiButton}
                            disabled={aiLoading}
                        >
                            {aiLoading ? '...' : 'RESEARCH'}
                        </button>
                    </div>

                    {aiLoading && (
                        <div style={styles.aiLoading}>
                            <p style={styles.aiLoadingText}>Researching {topic}...</p>
                        </div>
                    )}

                    {showAiPanel && !aiLoading && (
                        <div style={styles.aiResult}>
                            <div style={styles.aiResultHeader}>
                                <span style={styles.aiResultTitle}>RESEARCH · {aiTitle.toUpperCase()}</span>
                                <button onClick={() => setShowAiPanel(false)} style={styles.closeBtn}>✕</button>
                            </div>
                            <div style={styles.aiResultBody}>
                                <ReactMarkdown>{aiContent}</ReactMarkdown>
                            </div>
                            <div style={styles.aiResultFooter}>
                                <p style={styles.aiWarning}>
                                    ⚠ Verify these facts. Write in your own words.
                                </p>
                            </div>
                        </div>
                    )}

                    {!showAiPanel && !aiLoading && (
                        <div style={styles.aiEmpty}>
                            <p style={styles.aiEmptyText}>
                                Research a topic to get started.<br />The facts appear here — your voice stays yours.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const styles = {
    page: {
        minHeight: '100vh',
        backgroundColor: '#080808',
        padding: '28px 32px',
        boxSizing: 'border-box',
        position: 'relative',
        fontFamily: 'DM Sans, sans-serif',
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
    topBar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1400px',
        margin: '0 auto 20px',
        position: 'relative',
        zIndex: 1,
    },
    masthead: {},
    mastheadTitle: {
        fontSize: 20,
        fontWeight: 700,
        color: 'rgba(255,255,255,0.92)',
        letterSpacing: '-0.01em',
        fontFamily: 'Georgia, serif',
    },
    mastheadSub: {
        fontSize: 20,
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'Georgia, serif',
    },
    divider: {
        height: 1,
        background: 'rgba(255,255,255,0.08)',
        maxWidth: '1400px',
        margin: '0 auto 24px',
        position: 'relative',
        zIndex: 1,
    },
    topBarRight: {
        display: 'flex',
        gap: 10,
        alignItems: 'center',
    },
    cancelButton: {
        padding: '8px 18px',
        background: 'transparent',
        color: 'rgba(255,255,255,0.35)',
        border: '1px solid rgba(255,255,255,0.1)',
        cursor: 'pointer',
        fontSize: 9,
        letterSpacing: '0.25em',
        fontFamily: 'monospace',
    },
    button: {
        padding: '8px 20px',
        backgroundColor: 'rgba(255,255,255,0.92)',
        color: '#080808',
        border: 'none',
        cursor: 'pointer',
        fontSize: 9,
        letterSpacing: '0.25em',
        fontFamily: 'monospace',
        fontWeight: 700,
    },
    buttonDisabled: {
        padding: '8px 20px',
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,0.3)',
        border: 'none',
        cursor: 'not-allowed',
        fontSize: 9,
        letterSpacing: '0.25em',
        fontFamily: 'monospace',
    },
    error: {
        border: '1px solid rgba(200,60,60,0.4)',
        backgroundColor: 'rgba(200,60,60,0.08)',
        color: 'rgba(220,100,100,0.9)',
        padding: '10px 14px',
        marginBottom: 20,
        fontSize: 12,
        fontFamily: 'DM Sans, sans-serif',
        maxWidth: '1400px',
        margin: '0 auto 20px',
        position: 'relative',
        zIndex: 1,
    },
    workspace: {
        display: 'flex',
        gap: 20,
        maxWidth: '1400px',
        margin: '0 auto',
        alignItems: 'stretch',
        position: 'relative',
        zIndex: 1,
    },
    writePanel: {
        flex: '1.2',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
    },
    aiPanel: {
        flex: '1',
        backgroundColor: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.08)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
    },
    panelLabel: {
        fontSize: 9,
        letterSpacing: '0.3em',
        color: 'rgba(255,255,255,0.3)',
        fontFamily: 'monospace',
        marginBottom: 16,
    },
    titleInput: {
        width: '100%',
        padding: '10px 0',
        border: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        fontSize: 22,
        fontFamily: 'Lora, serif',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.88)',
        outline: 'none',
        marginBottom: 20,
        backgroundColor: 'transparent',
        boxSizing: 'border-box',
        letterSpacing: 'normal',
    },
    toolbar: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: 4,
        padding: '8px',
        backgroundColor: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderBottom: 'none',
    },
    toolbarBtn: {
        padding: '3px 9px',
        backgroundColor: 'transparent',
        border: '1px solid rgba(255,255,255,0.1)',
        color: 'rgba(255,255,255,0.5)',
        cursor: 'pointer',
        fontSize: 11,
        fontFamily: 'monospace',
    },
    textarea: {
        width: '100%',
        padding: '16px',
        border: '1px solid rgba(255,255,255,0.08)',
        borderTop: 'none',
        fontSize: 15,
        outline: 'none',
        resize: 'none',
        fontFamily: 'DM Sans, sans-serif',
        lineHeight: '1.8',
        color: 'rgba(255,255,255,0.75)',
        flex: 1,
        minHeight: '340px',
        boxSizing: 'border-box',
        backgroundColor: 'transparent',
    },
    hint: {
        fontSize: 9,
        color: 'rgba(255,255,255,0.2)',
        marginTop: 10,
        fontFamily: 'monospace',
        letterSpacing: '0.1em',
    },
    aiDesc: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.35)',
        lineHeight: '1.6',
        marginTop: -8,
        fontFamily: 'DM Sans, sans-serif',
    },
    aiRow: { display: 'flex', gap: 8 },
    aiInput: {
        flex: 1,
        padding: '9px 12px',
        border: '1px solid rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.04)',
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        outline: 'none',
        fontFamily: 'DM Sans, sans-serif',
        borderRadius: 0,
    },
    aiButton: {
        padding: '9px 16px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#080808',
        border: 'none',
        cursor: 'pointer',
        fontSize: 9,
        letterSpacing: '0.2em',
        fontFamily: 'monospace',
        fontWeight: 700,
        whiteSpace: 'nowrap',
    },
    aiButtonDisabled: {
        padding: '9px 16px',
        backgroundColor: 'rgba(255,255,255,0.15)',
        color: 'rgba(255,255,255,0.3)',
        border: 'none',
        cursor: 'not-allowed',
        fontSize: 9,
        letterSpacing: '0.2em',
        fontFamily: 'monospace',
        whiteSpace: 'nowrap',
    },
    aiLoading: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 0',
    },
    aiLoadingText: {
        color: 'rgba(255,255,255,0.25)',
        fontSize: 13,
        fontFamily: 'DM Sans, sans-serif',
    },
    aiEmpty: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
        border: '1px dashed rgba(255,255,255,0.08)',
    },
    aiEmptyText: {
        color: 'rgba(255,255,255,0.2)',
        fontSize: 13,
        lineHeight: '1.8',
        fontFamily: 'DM Sans, sans-serif',
    },
    aiResult: {
        flex: 1,
        border: '1px solid rgba(255,255,255,0.08)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
    },
    aiResultHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,255,255,0.03)',
    },
    aiResultTitle: {
        fontSize: 9,
        letterSpacing: '0.2em',
        color: 'rgba(255,255,255,0.4)',
        fontFamily: 'monospace',
    },
    closeBtn: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        fontSize: 12,
        color: 'rgba(255,255,255,0.25)',
        padding: 0,
    },
    aiResultBody: {
        padding: '16px',
        overflowY: 'auto',
        maxHeight: '420px',
        fontSize: 13,
        lineHeight: '1.8',
        color: 'rgba(255,255,255,0.6)',
        fontFamily: 'DM Sans, sans-serif',
    },
    aiResultFooter: {
        padding: '10px 14px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        backgroundColor: 'rgba(255,220,100,0.04)',
    },
    aiWarning: {
        fontSize: 11,
        color: 'rgba(220,180,60,0.7)',
        margin: 0,
        fontFamily: 'DM Sans, sans-serif',
    },
}

export default CreatePost