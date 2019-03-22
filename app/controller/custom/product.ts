'use strict';
/**
 * @description 小程序 商品列表接口
 */
import BaseController from '../BaseController';

const GetListInfo = {
  pageSize: 'number?',
  current: 'number?',
  category_id: 'number?',
  name: 'string?',
};

export default class MppProductController extends BaseController {
  /**
   * @description 小程序获取商品列表
   * @param GetListInfo pageSize 一页大小 current 当前页数
   */
  public async getList() {
    const { ctx, logger } = this;
    const { pageSize = 5, current = 1, category_id, name } = ctx.query;
    if (name) {
      return this.search();
    }

    try {
      ctx.validate(GetListInfo);
      const result = await ctx.service.custom.product.getList({ pageSize, current, category_id, name });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获取商品列表错误 MppProductController.getList.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
  /**
   * @description 小程序商品模糊查询
   * @param name 查询名
   */
  public async search() {
    const { ctx, logger } = this;
    const { name } = ctx.query;

    try {
      ctx.validate(GetListInfo);
      const result = await ctx.service.custom.product.search(name);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获取商品列表错误 MppProductController.search.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
}
