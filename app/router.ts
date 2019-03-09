'use strict';

import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;

  router.get('/', controller.home.index);

  /**
   * @description 小程序接口
   */

  /**
   * @description 管理端接口
   */
  router.post('/api/manage/admin/registe', controller.manage.admin.registe);
};
