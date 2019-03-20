'use strict';
/**
 * @description product controller
 */

import BaseController from '../BaseController';

const AddInfo = {
  name: 'string',
  price: 'string',
  description: 'string?',
  unit: 'string',
  category_id: 'number',
  state: 'number?',
  img: 'string?',
};

const ModifyInfo = {
  id: 'number',
  name: 'string?',
  price: 'string?',
  description: 'string?',
  unit: 'string?',
  category_id: 'number?',
  state: 'number?',
  img: 'string?',
};

const GetListInfo = {
  name: 'string?',
  pageSize: 'number?',
  current: 'number?',
};

export default class ProductController extends BaseController {
  /**
   * @description 添加商品
   */
  public async add() {
    const { ctx } = this;

    try {
      ctx.validate(AddInfo);
      const result = await ctx.service.manage.product.add(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：添加商品失败 ProductController.add.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 修改商品
   */
  public async modify() {
    const { ctx } = this;

    try {
      ctx.validate(ModifyInfo);
      const result = await ctx.service.manage.product.modify(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：修改商品信息失败 ProductController.modify.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 获取商品列表 或 根据名字查询商品
   */
  public async getList() {
    const { ctx } = this;
    const { name, pageSize = 5, current = 1 } = ctx.query;

    try {
      ctx.validate(GetListInfo);
      const result = await ctx.service.manage.product.getList({ name, pageSize, current });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：获取商品列表或查询失败 ProductController.getList.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
}
