import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const postRequest = async (url, data) => {
    try {
        const response = await axios.post(url, data, {
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (response) {
            return response.data
        }

    } catch (error) {
        console.log(error)
    }
}
