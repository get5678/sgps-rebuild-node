'use strict';

/**
 * @desc 请求参数日志打印中间件
 */

import { cloneDeep } from 'lodash';


/**
 * 修改限制数据
 * @param { Object } data 修改前数据
 * @param { String } encode 修改的内容
 * @param { Array } item 要修改的数据
 * @return { Object } 修改后数据
 */
const modifyData = (data, encode: string, item: any) => {
  item.forEach(element => {
    if (data[element]) {
      data[element] = encode;
    }
  });
  return data;
};

/**
 * 过滤限制数据
 * @param { Object } data 过滤前数据
 * @return { Object } 过滤后数据
 */
const filterLimitData = data => {
  const encode = '***';
  // 拷贝数据，防止修改原数据
  let result = cloneDeep(data);
  // 修改限制数据
  result = modifyData(result, encode, [ 'password', 'oldPassword', 'email' ]);

  return result;
};

module.exports = () => {
  return async function requestLogger(ctx, next) {
    const { logger } = ctx;
    // 日志数据过滤
    const body = filterLimitData(ctx.request.body);
    // 打印入参
    logger.info('request body: %j', body);
    await next();
    // 打印出参
    logger.info('response body: %j', ctx.body);
  };
};
