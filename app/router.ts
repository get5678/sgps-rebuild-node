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
  router.post('/api/manage/admin/registe', controller.manage.admin.registe);
};
