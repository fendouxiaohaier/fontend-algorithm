import axios from 'axios';
import AxiosWrapper from './utils/axiosWrapper';
import { Toast } from 'antd-mobile';
import { history } from '@/App';

export { default as requestErrorHandler } from './utils/requestErrorHandler';

const service = axios.create({
  baseURL: process.env.REACT_APP_BASEURL,
  timeout: 50000,
  withCredentials: true,
});

// Add a request interceptor
service.interceptors.request.use((config) => config, (error) => Promise.reject(error));

// Add a response interceptor
service.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          const href = window.location.href;
          if (href.includes('/login')) return; // 防止两个接口同时401，这里做了一下处理
          if (!href.includes('/home')) {
            history.replace(`/login?backUrl=${encodeURIComponent(href)}`);
          }
          break;

        default:
          Toast.info('请求数据错误');
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default new AxiosWrapper(service);
