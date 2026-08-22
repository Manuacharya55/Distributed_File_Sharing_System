import axios from "axios";

// Dedicated axios instance for Backend API calls
const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || "/api/v1",
    withCredentials: true,
});

let inMemoryToken = null;

export const setToken = (token) => {
    inMemoryToken = token;
};

// Request interceptor to attach JWT token to backend calls
apiClient.interceptors.request.use(
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

let refreshPromise = null;

const getRefreshedToken = () => {
    if (!refreshPromise) {
        refreshPromise = apiClient.get('/auth/refresh-token')
            .then((response) => {
                const newToken = response?.data?.data?.token;
                if (!newToken) throw new Error('No token in refresh response');
                setToken(newToken);
                return newToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

// Response interceptor to handle auto token refreshing
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            error.response.data?.message === "Token Expired" &&
            !originalRequest._retry &&
            !originalRequest.url.includes('/auth/refresh-token')
        ) {
            originalRequest._retry = true;
            try {
                const newToken = await getRefreshedToken();
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                setToken(null);
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


const extractErrorMessage = (error) => {
    const message = error?.response?.data?.message || error?.message || "An unexpected error occurred";
    const errors = error?.response?.data?.errors || [];
    const customError = new Error(message);
    customError.errors = errors;
    customError.statusCode = error?.response?.status;
    customError.response = error?.response;
    return customError;
};

// --- Backend API Requests ---

export const getRequest = async (url) => {
    try {
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error);
    }
};

export const postRequest = async (url, data) => {
    try {
        const response = await apiClient.post(url, data, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error);
    }
};

export const patchRequest = async (url, data) => {
    try {
        const response = await apiClient.patch(url, data, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error);
    }
};

export const deleteRequest = async (url, data) => {
    try {
        const response = await apiClient.delete(url, { data });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error);
    }
};

// --- Direct S3 Presigned Upload (Bypasses Node RAM) ---

export const uploadToS3PresignedUrl = async (presignedUrl, file, onProgress) => {
    const response = await fetch(presignedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`S3 upload failed (${response.status}): ${text}`);
    }

    if (onProgress) onProgress(100);
    return response;
};


// --- Multipart Requests ---

export const postMultipartRequest = async (url, formData) => {
    try {
        const response = await apiClient.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error);
    }
};

export const patchMultipartRequest = async (url, formData) => {
    try {
        const response = await apiClient.patch(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        return response.data;
    } catch (error) {
        throw extractErrorMessage(error);
    }
};
