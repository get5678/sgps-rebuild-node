'use strict';
/**
 * @description 小程序 订单接口
 */
import BaseController from '../BaseController';

const Info = {
  pageSize: 'string',
  current: 'string',
  product_id: 'string',
};

export default class MppCommentController extends BaseController {
  /**
   * @description 获取该商品的所有评论
   * @param Info pageSize 一页大小 current 当前页数 product_id 商品id
   */
  public async getList() {
    const { ctx, logger } = this;
    const { pageSize, current, product_id } = ctx.query;

    try {
      ctx.validate(Info, ctx.query);
      const result = await ctx.service.custom.comment.getList({ pageSize, current, product_id });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获取商品评论列表错误 MppCommentController.getList.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
  /**
   * @description 获取该订单的评论
   * @param orderId
   */
  public async order() {
    const { ctx, logger } = this;
    const { orderId } = ctx.query;

    try {
      const paramRule = {
        orderId: 'string',
      };
      ctx.validate(paramRule, ctx.query);
      const result = await ctx.service.custom.comment.order(orderId);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：获取该订单的评论 MppCommentController.order.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
  /**
   * @description 上传评论
   * @param comInfo orderId 订单Id productId 商品Id
   */
  public async post() {
    const { ctx, logger } = this;
    const { orderId, productId, message, star } = ctx.request.body;

    try {
      const comInfo = {
        orderId: 'int',
        productId: 'int',
        message: 'string',
        star: 'int',
      };
      ctx.validate(comInfo, ctx.request.body);
      const result = await ctx.service.custom.comment.post({
        orderId,
        productId,
        message,
        star,
      });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：上传评论 MppCommentController.post.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
}
