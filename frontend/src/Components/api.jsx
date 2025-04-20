  import axios from 'axios';
  import Cookies from 'js-cookie';

  // Create axios instance
  const api = axios.create({
    baseURL: 'http://localhost:5108/api', // Your API base URL
    withCredentials: true, // Ensures cookies are sent with requests
  });

  // Intercept requests to add the access token
  api.interceptors.request.use(config => {
    const token = Cookies.get('accessToken'); // Use 'accessToken' from cookies
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });

  // Intercept responses to handle expired access token
  api.interceptors.response.use(response => {
    return response;
  }, async error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark request as retried

      try {
        // Attempt to refresh the access token
        const refreshResponse = await axios.post('http://localhost:5108/refresh-token', {}, { withCredentials: true });
        const newAccessToken = refreshResponse.data.accessToken;

        // Set the new access token with an expiration of 5 seconds
        const expirationDate = new Date(Date.now() + 5 * 1000); // 5 seconds from now
        Cookies.set('accessToken', newAccessToken, { expires: expirationDate });

        // Update the Authorization header in the original request
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Handle refresh failure (e.g., logout user)
        console.error("Failed to refresh token", refreshError);
        Cookies.remove('accessToken'); // Remove the expired token
        Cookies.remove('refreshToken'); // Remove the refresh token
        window.location.href = '/login'; // Redirect to login page
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  });

  export default api; // Default export of the api instance
