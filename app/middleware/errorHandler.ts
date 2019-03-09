'use strict';
import { Context } from 'egg';

/**
 * @description 处理错误中间件
 */

export default (): any => {
  return async function errorHandler(ctx: Context, next: () => Promise<any>) {
    try {
      await next();
    } catch (err) {
      // 记录异常
      ctx.app.emit('error', err, ctx);
      console.log('error appear', err);

      const status = err.status || 500;
      // 500错误时候不返回客户端
      const error = (status === 500 && ctx.app.config.env === 'prod' ? 'Internal Server Error' : err.message);

      ctx.body = {
        code: '-1',
        error,
      };

      if (status === 422) {
        ctx.body.detail = err.errors;
      }
      ctx.status = status;
    }
  };
};
