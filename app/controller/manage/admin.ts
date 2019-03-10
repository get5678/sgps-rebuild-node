'use strict';
/**
 * @description 管理端
 */
import BaseController from '../BaseController';

const LoginInfo = {
  phone: 'string',
  password: 'string',
}

const RegisteInfo = {
  ...LoginInfo,
  identity: 'number',
  name: 'string',
}

export default class AdminController extends BaseController {
  /**
   * @description 管理端用户注册
   */
  public async registe() {
    const { ctx } = this;
    const { phone } = ctx.request.body;

    try {
      ctx.validate(RegisteInfo);
      const result = await ctx.service.manage.admin.registe(ctx.request.body);
      if (result.code && result) {
        return this.error({ code: result.code });
      }
      this.success(result);
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员注册错误 AdminController.register phone=${phone}, error: ${err}`);
      this.error({ code: -1 });
    }
  }

  /**
   * @description 管理端更新个人信息 修改密码
   */
  // public async update() {
  //   const { ctx } = this;
  // }
}
