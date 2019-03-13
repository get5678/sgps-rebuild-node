'use strict';
/**
 * @description 管理端
 */
import BaseController from '../BaseController';

const LoginInfo = {
  phone: 'string',
  password: 'string',
  code: 'string',
};

const RegisteInfo = {
  ...LoginInfo,
  identity: 'number',
  name: 'string',
};

const UpdateInfo = {
  phone: 'string',
  password: 'string',
};

const LogoutInfo = {
  phone: 'string',
};

const ListInfo = {
  pageSize: 'number?',
  pageNum: 'number?',
};

const ExamineInfo = {
  id: 'number',
  state: 'number',
};

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
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员注册错误 AdminController.register phone=${phone}, error: ${err}`);
      this.error({ code: -1 });
    }
  }

  /**
   * @description 管理端更新个人信息 修改密码
   */
  public async update() {
    const { ctx } = this;

    try {
      ctx.validate(UpdateInfo);
      const result = await ctx.service.manage.admin.upadte(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员信息修改错误 AdminController.update , error: ${err}`);
      this.error({ code: -1 });
    }
  }

  public async login() {
    const { ctx } = this;
    try {
      ctx.validate(LoginInfo);
      const result = await ctx.service.manage.admin.login(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员登陆错误 AdminController.login \n error: ${err}`);
      this.error({ code: -1 });
    }
  }

  public async logout() {
    const { ctx } = this;

    try {
      ctx.validate(LogoutInfo);
      const result = await ctx.service.manage.admin.logout(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员登出错误 AdminController.logout \n error: ${err}`);
      this.error({ code: -1 });
    }
  }

  public async getList() {
    const { ctx } = this;
    let { current = 1 } = ctx.query;
    let { pageSize = 5 } = ctx.query;
    try {
      ctx.validate(ListInfo);
      if (current <= 0) current = 1;
      if (pageSize <= 0) pageSize = 5;
      const result = await ctx.service.manage.admin.showAdmins({ current, pageSize });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员待审核人员列表错误 AdminController.getList \n error: ${err}`);
      this.error({ code: -1 });
    }
  }

  public async examine() {
    const { ctx } = this;

    try {
      ctx.validate(ExamineInfo);
      const result = await ctx.service.manage.admin.examine(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员待审核管理错误 AdminController.examine \n error: ${err}`);
      this.error({ code: -1 });
    }
  }
}
