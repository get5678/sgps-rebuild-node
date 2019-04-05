'use strict';
/**
 * @description 小程序 订单接口
 */
import BaseController from '../BaseController';

const GetListInfo = {
  pageSize: 'string?',
  current: 'string?',
  userId: 'string',
  state: 'string?',
};

const ModInfo = {
  userId: 'string',
  orderId: 'string',
};

export default class MppOrderController extends BaseController {
  /**
   * @description 小程序获取订单列表
   * @param GetListInfo pageSize 一页大小 current 当前页数 state 订单状态 userId 用户ID
   */
  public async getList() {
    const { ctx, logger } = this;
    const { pageSize = 5, current = 1, state = 0, userId } = ctx.query;

    try {
      ctx.validate(GetListInfo, ctx.query);
      const result = await ctx.service.custom.order.getList({ pageSize, current, state, userId });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获取订单列表错误 MppOrderController.getList.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }

  /**
   * @description 小程序修改订单状态
   * @param ModInfo userId 用户ID orderId 订单ID
   */
  public async ModOrder() {
    const { ctx, logger } = this;
    const { userId, orderId } = ctx.request.body;

    try {
      ctx.validate(ModInfo);
      const result = await ctx.service.custom.order.ModOrder({ userId, orderId });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：调整订单状态错误 MppOrderController.ModOrder.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
  /**
   * @description 小程序获取订单详情
   * @param ModInfo userId 用户ID orderId 订单ID
   */
  public async getOrderDetail() {
    const { ctx, logger } = this;
    const { userId, orderId } = ctx.query;

    try {
      ctx.validate(ModInfo);
      const result = await ctx.service.custom.order.getOrderDetail({ userId, orderId });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获得订单详情 MppOrderController.getOrderDetail.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
}
