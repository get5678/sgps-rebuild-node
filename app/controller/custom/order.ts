'use strict';
/**
 * @description 小程序 订单接口
 */
import BaseController from '../BaseController';

const GetListInfo = {
  pageSize: 'number?',
  current: 'number?',
  state: 'number?',
  userId: 'number?',
};

export default class MppOrderController extends BaseController {
  /**
   * @description 小程序获取订单列表
   * @param condition pageSize 一页大小 current 当前页数
   */
  public async getList() {
    const { ctx, logger } = this;
    const { pageSize = 5, current = 1, state, userId } = ctx.query;

    try {
      ctx.validate(GetListInfo);
      const result = await ctx.service.custom.order.getList({ pageSize, current, state, userId });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获取商品列表错误 GetIndexListController.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
