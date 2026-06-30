import axios from 'axios'

// Auth header is set via api.defaults.headers.common['Authorization']
// inside AuthContext after login/register/session restore.
const api = axios.create({ baseURL: '/api' })

export default api
