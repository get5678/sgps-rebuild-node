'use strict';
/**
 * @description coupons controller
 */

import BaseController from '../BaseController';

const AddInfo = {
  type: 'number',
  discount: 'number?',
  fill: 'number?',
  price: 'number?',
  limited_time: 'string',
  state: 'number?',
};

const ModifyInfo = {
  id: 'number',
  type: 'number?',
  discount: 'number?',
  fill: 'number?',
  price: 'number?',
  limited_time: 'string',
  state: 'number?',
};

const GetListInfo = {
  pageSize: 'number?',
  current: 'number?',
};

export default class CouponsController extends BaseController {
  /**
   * @description 添加优惠券
   */
  public async add() {
    const { ctx } = this;

    try {
      ctx.validate(AddInfo);
      const result = await ctx.service.manage.coupons.add(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：添加优惠券失败 CouponsController.add.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 修改优惠券信息
   */
  public async modify() {
    const { ctx } = this;

    try {
      ctx.validate(ModifyInfo);
      const result = await ctx.service.manage.coupons.modify(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：修改优惠券信息失败 CouponsController.modify.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 获取优惠券列表
   */
  public async getList() {
    const { ctx } = this;
    const { pageSize = 5, current = 1 } = ctx.query;

    try {
      ctx.validate(GetListInfo);
      const result = await ctx.service.manage.coupons.getList({ pageSize, current });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：修改优惠券信息失败 CouponsController.getList.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
}
