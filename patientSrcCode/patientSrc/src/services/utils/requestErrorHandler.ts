// 错误处理函数

import { BusinessError, NetError, CancelError } from './errors';

/* eslint-disable typescript/no-explicit-any */
interface ErrorHandlerConfig {
  business?: (code: number, message: string) => any;
  cancel?: () => any;
  net?: (code: number) => any;
}
/* eslint-enable typescript/no-explicit-any */

type CustomError = BusinessError | NetError | CancelError;

export default function errorHandler(error: Error, config?: ErrorHandlerConfig): void {
  const isCustomError = error instanceof BusinessError || error instanceof CancelError || error instanceof NetError;

  if (!isCustomError) {
    throw error;
  }

  if (!config) {
    (error as CustomError).defaultHandler();
  } else if (error instanceof BusinessError && typeof config.business === 'function') {
    config.business(error.code, error.message);
  } else if (error instanceof CancelError && typeof config.cancel === 'function') {
    config.cancel();
  } else if (error instanceof NetError && typeof config.net === 'function') {
    config.net(error.code);
  }
}
