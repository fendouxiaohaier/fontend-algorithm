import axios, { AxiosInstance, AxiosPromise, AxiosRequestConfig, CancelTokenSource, AxiosResponse } from 'axios';
import { BusinessError, CancelError, NetError } from './errors';

export interface ApiData<T = any> {
  errcode: number;
  data: T;
  errmsg: string;
}

type CustomError = BusinessError | CancelError | NetError;

type Executor<S> = (resolve: (data: S, res: AxiosResponse<S>) => void, reject: (error: CustomError) => void) => void;

export class AxiosCancelablePromise<T> extends Promise<T> {
  public cancelTokenSource: CancelTokenSource;

  public constructor(executor: Executor<T>, cancelTokenSource: CancelTokenSource) {
    super(executor);

    this.cancelTokenSource = cancelTokenSource;
  }

  public cancel() {
    this.cancelTokenSource.cancel();
  }
}

class Wrapper {
  public axiosInstance: AxiosInstance;

  public constructor(axiosInstance: AxiosInstance) {
    this.axiosInstance = axiosInstance;
  }

  public static wrapRequest(request: AxiosPromise<ApiData>, cancelTokenSource: CancelTokenSource) {
    return new AxiosCancelablePromise<ApiData>((resolve, reject) => {
      request
        .then((res) => {
          const { data, status } = res;
          if (!(status >= 200 && status < 300)) {
            return reject(new NetError(status));
          }

          if (data.errcode > 0) {
            return reject(new BusinessError(data.errcode, data.errmsg));
          }

          return resolve(data, res);
        })
        .catch((error) => {
          if (axios.isCancel(error)) {
            return reject(new CancelError('Request canceled'));
          }

          const status = Number(error.code) || 0;

          return reject(new NetError(status));
        });
    }, cancelTokenSource);
  }

  public head(url: string, config?: AxiosRequestConfig) {
    const cancelTokenSource = axios.CancelToken.source();

    return Wrapper.wrapRequest(
      this.axiosInstance.head(
        url,
        Object.assign({}, config, {
          withCredentials: true,
          cancelToken: cancelTokenSource.token,
        })
      ),
      cancelTokenSource
    );
  }

  public get(url: string, config?: AxiosRequestConfig) {
    const cancelTokenSource = axios.CancelToken.source();

    return Wrapper.wrapRequest(
      this.axiosInstance.get(
        url,
        Object.assign({}, config, {
          withCredentials: true,
          cancelToken: cancelTokenSource.token,
        })
      ),
      cancelTokenSource
    );
  }

  public delete(url: string, config?: AxiosRequestConfig) {
    const cancelTokenSource = axios.CancelToken.source();

    return Wrapper.wrapRequest(
      this.axiosInstance.delete(
        url,
        Object.assign({}, config, {
          withCredentials: true,
          cancelToken: cancelTokenSource.token,
        })
      ),
      cancelTokenSource
    );
  }

  // eslint-disable-next-line typescript/no-explicit-any
  public post(url: string, data?: any, config?: AxiosRequestConfig) {
    const cancelTokenSource = axios.CancelToken.source();

    return Wrapper.wrapRequest(
      this.axiosInstance.post(
        url,
        data,
        Object.assign({}, config, {
          withCredentials: true,
          cancelToken: cancelTokenSource.token,
        })
      ),
      cancelTokenSource
    );
  }

  // eslint-disable-next-line typescript/no-explicit-any
  public put(url: string, data?: any, config?: AxiosRequestConfig) {
    const cancelTokenSource = axios.CancelToken.source();

    return Wrapper.wrapRequest(
      this.axiosInstance.put(
        url,
        data,
        Object.assign({}, config, {
          withCredentials: true,
          cancelToken: cancelTokenSource.token,
        })
      ),
      cancelTokenSource
    );
  }

  // eslint-disable-next-line typescript/no-explicit-any
  public patch(url: string, data?: any, config?: AxiosRequestConfig) {
    const cancelTokenSource = axios.CancelToken.source();

    return Wrapper.wrapRequest(
      this.axiosInstance.patch(
        url,
        data,
        Object.assign({}, config, {
          withCredentials: true,
          cancelToken: cancelTokenSource.token,
        })
      ),
      cancelTokenSource
    );
  }
}

export default Wrapper;
