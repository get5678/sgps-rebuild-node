'use strict';
/**
 * @description 状态码
 */

const Code = {
  1: '请求成功',
  1000: '未知错误',
  2000: '未登录',
  2001: '此手机号已使用',
  2002: '此用户名已被使用',
  2003: '此用户不存在',
  2004: '用户名或密码错误',
  2005: '用户权限不足',
  2006: '请输入11有效手机号和至少6位的密码',
  2007: '登陆过期',
  2008: '你已登录',
  3000: '优惠券数量不足',
  3001: '优惠券领取成功',
  3002: '已领取过该优惠券',
  4000: '请求参数非法',
  4001: '缺少必要参数',
  5000: '查询失败',
  6000: '服务器内部错误',
  6200: '接口暂时无法访问',
  7000: '暂无待审核用户',
  7001: '请求页数超出总数',
};

export { Code };
