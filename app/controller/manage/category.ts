'use strict';
/**
 * @description category controller
 */

import BaseController from '../BaseController';

const AddInfo = {
  name: 'string',
};

const ModifyInfo = {
  id: 'number',
  name: 'string?',
  state: 'number?',
  is_delete: 'number?',
};

const SearchInfo = {
  pageSize: 'number?',
  current: 'number?',
  name: 'string?',
};

export default class CategoryController extends BaseController {
  /**
   * @description 添加商品种类
   */
  public async add() {
    const { ctx } = this;

    try {
      ctx.validate(AddInfo);
      const result = await ctx.service.manage.category.add(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：添加商品种类失败 CategoryController.add.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 修改商品种类信息
   */
  public async modify() {
    const { ctx } = this;

    try {
      ctx.validate(ModifyInfo);
      const result = await ctx.service.manage.category.modify(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：修改商品种类失败 CategoryController.modify.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 查询或获取列表
   */
  public async search() {
    const { ctx } = this;
    const { pageSize = 5, current = 1, name } = ctx.query;

    try {
      ctx.validate(SearchInfo);
      const result = await ctx.service.manage.category.search({ pageSize, current, name });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：修改商品种类失败 CategoryController.modify.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
}
