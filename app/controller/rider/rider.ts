'use strict';
/**
 * @description 小程序 骑手基础接口
 */
import BaseController from '../BaseController';

const GetListInfo = {
  pageSize: 'string',
  current: 'string',
  riderId: 'string',
  state: 'string?',
};

const ModInfo = {
  riderId: 'number',
  orderId: 'number',
  state: 'number',
};

export default class RiderController extends BaseController {
  /**
   * @description 小程序获得骑手订单
   */
  public async getList() {
    const { ctx, logger } = this;
    const { pageSize, current, state, riderId } = ctx.query;

    try {
      ctx.validate(GetListInfo, ctx.query);
      const result = await ctx.service.rider.rider.getList({ pageSize, current, state, riderId });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获得骑手订单 RiderController.getList.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
  /**
   * @description 小程序骑手订单状态
   * @param ModInfo riderId 骑手ID orderId 订单ID
   */
  public async ModOrder() {
    const { ctx, logger } = this;
    const { riderId, orderId, state } = ctx.request.body;

    try {
      ctx.validate(ModInfo);
      const result = await ctx.service.rider.rider.ModOrder({ riderId, orderId, state });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：骑手订单状态错误 RiderController.ModOrder.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
}
