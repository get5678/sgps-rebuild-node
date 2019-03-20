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
  2009: '验证码错误',
  3000: '优惠券数量不足',
  3001: '优惠券领取成功',
  3002: '已领取过该优惠券',
  3003: '该优惠券不存在',
  4000: '请求参数非法',
  4001: '缺少必要参数',
  5000: '查询失败',
  5001: '不存在该用户',
  6000: '服务器内部错误',
  6200: '接口暂时无法访问',
  7000: '数据无效或参数错误',
  7001: '请求页数超出总数',
  8000: '该种类已存在',
  9001: '该楼栋已存在',
  9002: '该楼栋名已存在',
  9100: '该商品已存在',
  9101: '该商品不存在',
  9102: '商品名称重复',
};

export { Code };
