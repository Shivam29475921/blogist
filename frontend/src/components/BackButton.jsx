import { useNavigate } from 'react-router-dom'

function BackButton() {
    const navigate = useNavigate()
    return (
        <button onClick={() => navigate(-1)} style={styles.btn}>
            ← Back
        </button>
    )
}

const styles = {
    btn: {
        background: 'none',
        border: 'none',
        color: '#888',
        fontSize: '13px',
        cursor: 'pointer',
        padding: '0',
        fontFamily: 'DM Sans, sans-serif',
        marginBottom: '24px',
        display: 'inline-block',
    }
}

export default BackButton