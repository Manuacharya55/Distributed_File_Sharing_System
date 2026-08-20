import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;

let inMemoryToken = null;

export const setToken = (token) => {
    inMemoryToken = token;
};

axios.interceptors.request.use(
    (config) => {
        if (inMemoryToken) {
            config.headers.Authorization = `Bearer ${inMemoryToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    
    failedQueue = [];
};

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        console.log(error)
        if (error.response && error.response.status === 401 && error.response.data?.message === "Token Expired" && !originalRequest._retry) {
            if (originalRequest.url.includes('/auth/refresh-token')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function(resolve, reject) {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    originalRequest.headers.Authorization = 'Bearer ' + token;
                    return axios(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;
            
            try {
                // baseURL is applied automatically by axios
                const response = await axios.get('/auth/refresh-token');
                if (response.data && response.data.data && response.data.data.token) {
                    const newToken = response.data.data.token;
                    setToken(newToken);
                    
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    processQueue(null, newToken);
                    return axios(originalRequest);
                }
            } catch (refreshError) {
                // Refresh token is expired or invalid
                processQueue(refreshError, null);
                setToken(null);
                window.location.href = '/'; 
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        
        return Promise.reject(error);
    }
);

// --- JSON Requests ---

export const getRequest = async (url) => {
    try {
        const response = await axios.get(url);
        if (response) {
            return response.data;
        }
    } catch (error) {
        return {
            success : false,
            message : error?.response?.data?.message || error.message,
            errors : error?.response?.data?.errors || []
        }
    }
};

export const postRequest = async (url, data) => {
    try {
        const response = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response) {
            return response.data;
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message,
            errors : error?.response?.data?.errors || []
        }
    }
};

export const patchRequest = async (url, data) => {
    try {
        const response = await axios.patch(url, data, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (response) {
            return response.data;
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message,
            errors : error?.response?.data?.errors || []
        }
    }
};

export const deleteRequest = async (url) => {
    try {
        const response = await axios.delete(url);
        if (response) {
            return response.data;
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message,
            errors : error?.response?.data?.errors || []
        }
    }
};

// --- Multipart (File Upload) Requests ---

export const postMultipartRequest = async (url, formData) => {
    try {
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (response) {
            return response.data;
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message,
            errors : error?.response?.data?.errors || []
        }
    }
};

export const patchMultipartRequest = async (url, formData) => {
    try {
        const response = await axios.patch(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        if (response) {
            return response.data;
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || error.message,
            errors : error?.response?.data?.errors || []
        }
    }
};
