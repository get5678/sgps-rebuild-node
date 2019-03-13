'use strict';
/**
 * @description 管理用户
 */

import BaseController from '../BaseController';

const ListInfo = {
  pageSize: 'number?',
  pageNum: 'number?',
};

const UpdateInfo = {
  id: 'number',
  name: 'string?',
  phone: 'string?',
  sex: 'number?',
};

const SearchInfo = {
  pageSize: 'number?',
  pageNum: 'number?',
  name: 'string?',
  building: 'string?',
};


export default class UserController extends BaseController {
  /**
   * @description 获取列表
   */
  public async getList() {
    const { ctx } = this;
    const { current = 1 } = ctx.query;
    const { pageSize = 5 } = ctx.query;

    try {
      ctx.validate(ListInfo);
      const result = await ctx.service.manage.user.getList({ current, pageSize });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：获取用户列表错误 AdminController.getList error: ${err}`);
      this.error({ code: -1 });
    }
  }
  /**
   * @description 修改用户信息
   */
  public async update() {
    const { ctx } = this;
    const { sex } = ctx.request.body;
    if (Number(sex)) {
      if (Number(sex) > 1 || Number(sex) < 0) return this.error({ code: 4000 });
    }

    try {
      ctx.validate(UpdateInfo);
      const result = await ctx.service.manage.user.update(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：用户信息更新错误 AdminController.update error: ${err}`);
      this.error({ code: -1 });
    }
  }

  public async search() {
    const { ctx } = this;
    const { name = '' } = ctx.query;
    const { building = '' } = ctx.query;
    const { pageSize = 5 } = ctx.query;
    const { current = 1 } = ctx.query;

    try {
      ctx.validate(SearchInfo);
      const result = await ctx.service.manage.user.search({ name, building, pageSize, current });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：用户搜索失败 AdminController.search error: ${err}`);
      this.error({ code: 4001 });
    }
  }
}
