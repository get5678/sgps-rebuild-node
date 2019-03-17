'use strict';

import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  /**
   * @description 小程序接口
   */
  router.get('/api/custom/banner', controller.custom.banner.banner);
  // 登陆接口
  router.post('/api/custom/user/userLogin', controller.user.login.userLogin);

  /**
   * @description 管理端接口
   */
  // 管理员账号管理
  router.post('/api/manage/admin/registe', controller.manage.admin.registe);
  router.post('/api/manage/admin/update', controller.manage.admin.update);
  router.post('/api/manage/admin/login', controller.manage.admin.login);
  router.post('/api/manage/admin/logout', controller.manage.admin.logout);
  router.post('/api/manage/admin/examine', controller.manage.admin.examine);
  router.get('/api/manage/admin/getList', controller.manage.admin.getList);

  // 用户管理
  router.get('/api/manage/user/getList', controller.manage.user.getList);
  router.get('/api/manage/user/search', controller.manage.user.search);
  router.post('/api/manage/user/update', controller.manage.user.update);

  // 获取验证码
  router.get('/api/verify/getCaptcha', controller.manage.verify.getCaptcha);

  // 骑手管理
  router.post('/api/manage/rider/registe', controller.manage.rider.registe);
  router.post('/api/manage/rider/update', controller.manage.rider.update);
  router.post('/api/manage/rider/delete', controller.manage.rider.delete);
  router.get('/api/manage/rider/search', controller.manage.rider.search);
  router.get('/api/manage/rider/getList', controller.manage.rider.getList);

  // 商品种类管理
  router.post('/api/manage/category/add', controller.manage.category.add);
  router.post('/api/manage/category/modify', controller.manage.category.modify);
  router.get('/api/manage/category/search', controller.manage.category.search);

  // 楼栋管理
  router.post('/api/manage/building/add', controller.manage.building.add);
  router.post('/api/manage/building/modify', controller.manage.building.modify);
  router.get('/api/manage/building/getList', controller.manage.building.getList);

  // 商品管理
  router.post('/api/manage/product/add', controller.manage.product.add);
  router.post('/api/manage/product/modify', controller.manage.product.modify);
  router.get('/api/manage/product/getList', controller.manage.product.getList);

  // 优惠券管理
  router.post('/api/manage/coupons/add', controller.manage.coupons.add);
  router.post('/api/manage/coupons/modify', controller.manage.coupons.modify);
  router.get('/api/manage/coupons/getList', controller.manage.coupons.getList);
};
