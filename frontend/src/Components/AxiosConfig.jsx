import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: 'http://localhost:5108/api'
});


const setupInterceptors = (handleLogout) => {
  api.interceptors.request.use(config => {
    const token = Cookies.get('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });
  

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        handleLogout(); // Call logout if unauthorized
      }
      return Promise.reject(error);
    }
  );
};

export { api, setupInterceptors };
