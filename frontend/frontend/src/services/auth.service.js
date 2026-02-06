import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

export const authService = {
    login: async (email, password) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, { email, password });
            const data = response.data;

            // Simple mapping: no more document path logic needed
            const user = {
                id: data.id || data.userId,
                email: data.email,
                role: data.role,
                username: data.username,
                isVerified: true // Forced true as documents are removed
            };

            sessionStorage.setItem("user", JSON.stringify(user));
            return user;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Login failed");
        }
    },

    register: async (userData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Registration failed");
        }
    },

    logout: () => {
        sessionStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: () => {
        try {
            const user = sessionStorage.getItem('user');
            return (user && user !== 'undefined') ? JSON.parse(user) : null;
        } catch (error) {
            return null;
        }
    }
};