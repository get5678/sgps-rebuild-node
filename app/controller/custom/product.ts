'use strict';
/**
 * @description 小程序 商品列表接口
 */
import BaseController from '../BaseController';

const GetListInfo = {
  pageSize: 'string?',
  current: 'string?',
  category_id: 'string?',
  name: 'string?',
};

export default class MppProductController extends BaseController {
  /**
   * @description 小程序获取商品列表
   * @param GetListInfo pageSize 一页大小 current 当前页数
   */
  public async getList() {
    const { ctx, logger } = this;
    const { pageSize, current, category_id, name } = ctx.query;
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
  /**
   * @description 小程序获得商品种类
   */
  public async getSpecies() {
    const { ctx, logger } = this;

    try {
      const result = await ctx.service.custom.product.getSpecies();
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获得商品种类表错误 MppProductController.getSpecies.\n Error: ${err}`);
      this.error({
        code: 1000,
      });
    }
  }
  /**
   * @description 获取商品详情
   * @param product_id 商品ID
   */
  public async getDetail() {
    const { ctx, logger } = this;
    const { product_id } = ctx.query;

    try {
      const result = await ctx.service.custom.product.getDetail(product_id);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获取商品详情 MppProductController.getDetail.\n Error: ${err}`);
      this.error({
        code: 1000,
      });
    }
  }
}
