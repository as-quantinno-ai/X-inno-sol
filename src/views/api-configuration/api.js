import axios from "axios";
import { dispatch, persister } from "store";
import { baseUrl, refreshTokenUrl } from "./default";
import { resetStateAction } from "store/actions";

const api = axios.create({
    baseURL: baseUrl
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("serviceToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If the error status is 401 and there is no originalRequest._retry flag,
        // it means the token has expired and we need to refresh it
        if (error.response.status === 401 && !originalRequest.retry) {
            originalRequest.retry = true;

            try {
                const refreshToken = localStorage.getItem("serviceRefreshToken");
                // const refreshToken = useSelector((state) => state.auth.refreshToken);
                const response = await axios.post(`${refreshTokenUrl}${refreshToken}`, {});
                const accessToken = response.data.result.access_token;

                localStorage.setItem("serviceToken", accessToken);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return axios(originalRequest);
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                return (
                    localStorage?.clear(), dispatch(resetStateAction()), persister.pause(), persister.flush().then(() => persister.purge())
                );

                // Handle refresh token error or redirect to login
            }
        }

        return Promise.reject(error);
    }
);

export default api;
