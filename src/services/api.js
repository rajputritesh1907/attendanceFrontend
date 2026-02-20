import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor to add token to requests
api.interceptors.request.use(
    (config) => {
        const userString = localStorage.getItem('user');
        if (userString) {
            const { token } = JSON.parse(userString);
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (userData) => api.post('/auth/login', userData),
    getProfile: () => api.get('/auth/profile'),
};

export const attendanceService = {
    checkIn: () => api.post('/attendance/check-in'),
    checkOut: () => api.post('/attendance/check-out'),
    getAttendance: () => api.get('/attendance/history'),
    getTodayStatus: () => api.get('/attendance/today'),
};

export const taskService = {
    getTasks: () => api.get('/tasks'),
    updateTask: (id, taskData) => api.put(`/tasks/${id}`, taskData),
    deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export const adminService = {
    getAllUsers: () => api.get('/admin/users'),
    addUser: (userData) => api.post('/admin/users', userData),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    assignTask: (taskData) => api.post('/admin/tasks', taskData),
    getAllTasks: () => api.get('/admin/tasks'),
    deleteTask: (id) => api.delete(`/admin/tasks/${id}`),
};

export default api;
