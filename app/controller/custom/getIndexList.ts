'use strict';
/**
 * @description 小程序 首页商品接口
 */
import BaseController from '../BaseController';

const GetListInfo = {
  pageSize: 'string?',
  current: 'string?',
};

export default class GetIndexListController extends BaseController {
  /**
   * @description 小程序获取首页商品列表
   * @param condition pageSize 一页大小 current 当前页数
   */
  public async getList() {
    const { ctx, logger } = this;
    const { pageSize = 5, current = 1 } = ctx.query;

    try {
      ctx.validate(GetListInfo, ctx.query);
      const result = await ctx.service.custom.getIndexList.getList({ pageSize, current });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获取商品列表错误 GetIndexListController.getList.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
}
