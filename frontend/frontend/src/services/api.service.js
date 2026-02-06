import axios from 'axios';

const BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 30000

});

// URL Safety Interceptor
apiClient.interceptors.request.use((config) => {
    const fullUrl = config.baseURL + config.url;
    if (fullUrl.includes('undefined')) {
        console.error("❌ Request Blocked: URL contains 'undefined'.", fullUrl);
        return Promise.reject(new Error("Invalid URL: contains undefined variable"));
    }
    return config;
});

export const apiService = {
    get: (url) => apiClient.get(url).then(res => res.data),
    post: (url, data) => apiClient.post(url, data).then(res => res.data),
    put: (url, data) => apiClient.put(url, data).then(res => res.data),
    delete: (url) => apiClient.delete(url).then(res => res.data),

    // PRODUCT ENDPOINTS
    getProducts: () => apiClient.get('/admin/products').then(res => res.data),

    // ORDER ENDPOINTS
    placeOrder: (orderData) => apiClient.post('/orders/place', orderData).then(res => res.data),
    getRetailerOrders: (id) => apiClient.get(`/orders/retailer/${id}`).then(res => res.data),
    getFarmerOrders: (id) => apiClient.get(`/orders/farmer/${id}`).then(res => res.data),

    // ORDER STATUS UPDATES
    updateOrderStatus: (orderId, status) =>
        apiClient.put(`/orders/${orderId}/status?status=${status}`).then(res => res.data),

    adminUpdateStatus: (id, status) =>
        apiClient.put(`/admin/orders/${id}/status?status=${status}`).then(res => res.data),

    adminVerifyDelivery: (id, otp) =>
        apiClient.put(`/admin/orders/${id}/verify-delivery?otp=${otp}`).then(res => res.data),

    settleOrder: (id) =>
        apiClient.put(`/admin/orders/${id}/settle`).then(res => res.data)
};