import { Toast } from 'antd-mobile';

// 业务异常
export class BusinessError extends Error {
  public readonly code: number;

  public constructor(code: number, message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessError);
    }
    this.code = code;
  }

  public defaultHandler = () => {
    Toast.info(this.message);
  };
}

// 网络异常
export class NetError extends Error {
  public readonly code: number;

  public constructor(code: number) {
    super();

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BusinessError);
    }

    this.code = code;
  }

  public defaultHandler = () => {
    let content = '';
    switch (this.code) {
      case 400:
        content = '请求参数错误！';
        break;
      case 500:
        content = '服务器内部错误！';
        break;
      default:
        content = this.message;
    }

    Toast.info(content);
  };
}

// 中断异常
export class CancelError extends Error {
  public constructor(message: string) {
    super(message);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CancelError);
    }
  }

  // eslint-disable-next-line
  public defaultHandler = () => {
    console.error('Request canceled');
  };
}
