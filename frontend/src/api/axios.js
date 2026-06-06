import axios from 'axios';
const AUTH_URL= 'http://localhost:8001'
const POST_URL = 'http://localhost:8002'
const COMMENT_URL='http://localhost:8003'
const AI_URL= 'http://localhost:8004'

const getAuthHeader =()=> {
    const token = localStorage.getItem('access_token') || localStorage.getItem('token');
    return token ? {
        Authorization: `Bearer ${token}`
    } : {}
}

//Auth servies
export const authAPI ={
    register: (data)=> axios.post(`${AUTH_URL}/api/auth/register/`, data),
    login: (data) => axios.post(`${AUTH_URL}/api/auth/login/`, data),
    profile: () => axios.get(`${AUTH_URL}/api/auth/profile/`, { headers: getAuthHeader() })
}

//post services
export const postAPI = {
    getPosts: ()=> axios.get(`${POST_URL}/api/posts/`),
    getPost: (id) => axios.get(`${POST_URL}/api/posts/${id}/`),
    createPost: (data) => axios.post(`${POST_URL}/api/posts/create/`, data, { headers: getAuthHeader() }),
    deletePost: (id) => axios.delete(`${POST_URL}/api/posts/${id}/`, { headers: getAuthHeader() })

}

//comment service
export const commentAPI={
    getComments: (postId) => axios.get(`${COMMENT_URL}/api/comments/?post=${postId}`),
    addComment: (data) => axios.post(`${COMMENT_URL}/api/comments/`, data, { headers: getAuthHeader() })
}
//AI Service
export const aiAPI={
    generateBlog: (topic)=> axios.post(`${AI_URL}/api/ai/generate-blog/`, { topic }, { headers: getAuthHeader() })
}
