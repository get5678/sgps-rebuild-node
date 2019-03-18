'use strict';
/**
 * @description order controller
 */

import BaseController from '../BaseController';

const GetListInfo = {
  pageSize: 'number?',
  current: 'number?',
};

export default class OrderController extends BaseController {

  public async getList() {
    const { ctx } = this;
    const { pageSize = 5, current = 1 } = ctx.query;

    try {
      ctx.validate(GetListInfo);
      const result = await ctx.service.manage.order.getList({ pageSize, current });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：获取订单列表错误 OrderController.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
