'use strict';
/**
 * @description 小程序 优惠券
 */
import BaseController from '../BaseController';

const GetListInfo = {
  pageSize: 'string?',
  current: 'string?',
  userId: 'string?',
};

export default class MppCouponsController extends BaseController {
  /**
   * @description 小程序获取优惠券列表
   * @param GetListInfo pageSize 一页大小 current 当前页数 userId 用户ID
   */
  public async getList() {
    const { ctx, logger } = this;
    const { pageSize = 5, current = 1, userId } = ctx.query;

    try {
      ctx.validate(GetListInfo);
      const result = await ctx.service.custom.coupons.getList({ pageSize, current, userId });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获取优惠券列表错误 MppCouponsController.getList.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
}
