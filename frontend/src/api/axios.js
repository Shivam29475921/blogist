import axios from 'axios'

const AUTH_URL = 'http://localhost:8001'
const POST_URL = 'http://localhost:8002'
const COMMENT_URL = 'http://localhost:8003'
const AI_URL = 'http://localhost:8004'
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
}
