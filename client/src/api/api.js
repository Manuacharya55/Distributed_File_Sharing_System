import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
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
        console.log(error);
        throw error;
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
        console.log(error);
        throw error;
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
        console.log(error);
        throw error;
    }
};

export const deleteRequest = async (url) => {
    try {
        const response = await axios.delete(url);
        if (response) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

// --- Multipart (File Upload) Requests ---

export const postMultipartRequest = async (url, formData) => {
    try {
        console.log(formData)
        const response = await axios.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log(response)
        if (response) {
            return response.data;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
};

