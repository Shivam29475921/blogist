import axios from 'axios'

const AUTH_URL = ''
const POST_URL = ''
const COMMENT_URL = ''
const AI_URL = ''

const getAuthHeaders = () => {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token')
    return token ? { Authorization: `Bearer ${token}` } : {}
}

export const authAPI = {
    register: (data) => axios.post(`${AUTH_URL}/api/auth/register/`, data),
    login: (data) => axios.post(`${AUTH_URL}/api/auth/login/`, data),
    profile: () => axios.get(`${AUTH_URL}/api/auth/profile/`, {
        headers: getAuthHeaders()
    }),
    updateProfile: (data) => axios.put(`${AUTH_URL}/api/auth/profile/`, data, {
        headers: getAuthHeaders()
    }),
    publicProfile: (username) => axios.get(`${AUTH_URL}/api/auth/users/${username}/`),
    followStatus: (username) => axios.get(`${AUTH_URL}/api/auth/users/${username}/follow-status/`, {
        headers: getAuthHeaders()
    }),
    toggleFollow: (username) => axios.post(`${AUTH_URL}/api/auth/users/${username}/follow/`, {}, {
        headers: getAuthHeaders()
    }),
}

export const postAPI = {
    getPosts: () => axios.get(`${POST_URL}/api/posts/`),
    getPostsByAuthor: (username) => axios.get(`${POST_URL}/api/posts/?author=${username}`),
    getPost: (id) => axios.get(`${POST_URL}/api/posts/${id}/`),
    createPost: (data) => axios.post(`${POST_URL}/api/posts/create/`, data, {
        headers: getAuthHeaders()
    }),
    deletePost: (id) => axios.delete(`${POST_URL}/api/posts/${id}/`, {
        headers: getAuthHeaders()
    }),
    toggleLike: (id) => axios.post(`${POST_URL}/api/posts/${id}/like/`, {}, {
        headers: getAuthHeaders()
    }),
}

export const commentAPI = {
    getComments: (postId) => axios.get(`${COMMENT_URL}/api/comments/${postId}/`),
    addComment: (data) => axios.post(`${COMMENT_URL}/api/comments/`, data, {
        headers: getAuthHeaders()
    }),
}

export const aiAPI = {
    generateBlog: (topic) => axios.post(`${AI_URL}/api/ai/generate-blog/`, { topic }, {
        headers: getAuthHeaders()

    }),
     analyzeWriting: (content) => axios.post(`${AI_URL}/api/ai/analyze-writing/`, { content }),
}

export const notificationAPI = {
    getAll: async () => {
        const [followNotifications, likeNotifications] = await Promise.all([
            axios.get(`${AUTH_URL}/api/auth/notifications/`, {
                headers: getAuthHeaders()
            }),
            axios.get(`${POST_URL}/api/posts/notifications/`, {
                headers: getAuthHeaders()
            }),
        ])

        const notifications = [
            ...followNotifications.data.notifications,
            ...likeNotifications.data.notifications,
        ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

        return {
            notifications,
            unread_count:
                followNotifications.data.unread_count +
                likeNotifications.data.unread_count,
        }
    },

    markRead: () => axios.post(`${AUTH_URL}/api/auth/notifications/read/`, {}, {
        headers: getAuthHeaders()
    }),
}

// Interceptor — silently refresh access token on 401
axios.interceptors.response.use(
    response => response,
    async error => {
        const original = error.config

        // Skip if it's already a retry or a refresh/login request
        if (
            error.response?.status === 401 &&
            !original._retry &&
            !original.url?.includes('/token/refresh/') &&
            !original.url?.includes('/login/')
        ) {
            original._retry = true
            try {
                const refresh = localStorage.getItem('refresh_token')
                if (!refresh) throw new Error('No refresh token')

                const res = await axios.post(
                    `${AUTH_URL}/api/auth/token/refresh/`,
                    { refresh }
                )

                const newAccess = res.data.access
                const newRefresh = res.data.refresh // save new refresh too (ROTATE_REFRESH_TOKENS=True)

                localStorage.setItem('access_token', newAccess)
                if (newRefresh) localStorage.setItem('refresh_token', newRefresh)

                original.headers['Authorization'] = `Bearer ${newAccess}`
                return axios(original)

            } catch (e) {
                // Refresh failed — session truly over, force logout
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
                localStorage.removeItem('token')
                window.location.href = '/login'
            }
        }

        return Promise.reject(error)
    }
)