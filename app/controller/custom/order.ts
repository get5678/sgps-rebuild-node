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
  userId: 'number',
  orderId: 'number',
  state: 'number',
};

const GetOrderInfo = {
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
    const { userId, orderId, state } = ctx.request.body;

    try {
      ctx.validate(ModInfo, ctx.request.body);
      const result = await ctx.service.custom.order.ModOrder({ userId, orderId, state });
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
   * @param GetOrderInfo userId 用户ID orderId 订单ID
   */
  public async getOrderDetail() {
    const { ctx, logger } = this;
    const { userId, orderId } = ctx.query;

    try {
      ctx.validate(GetOrderInfo);
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
  /**
   * @description 小程序创建订单
   */
  public async createOrder() {
    const { ctx, logger } = this;
    const {
      order_product,
      order_send_time,
      order_total_price,
      order_address_id,
      order_coupons_code,
      order_message,
      // sessionId
    } = ctx.request.body;

    const createRule = {
      order_product: 'array',
      order_send_time: 'string',
      order_total_price: 'number',
      order_address_id: 'number',
      order_coupons_code: 'number?',
      order_message: 'string?',
      // sessionId: 'string',
    };

    // 从redis中获取信息
    // const sessionId = ctx.get('Cookie');
    // const userInfo = await this.app.redis.get(sessionId);
    // const { user_id, openId } = JSON.parse(userInfo);

    try {
      ctx.validate(createRule, ctx.request.body);
      const result = await ctx.service.custom.order.createOrder({
        order_product,
        order_send_time,
        order_total_price,
        order_address_id,
        order_coupons_code,
        order_message,
        // user_id,
        // openId,
        userId: 27,
        openId: 'oghf-4-t7rbY8RHW5hkPNPMi5L0Q',
      });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      logger.error(`========小程序：小程序创建订单 MppOrderController.createOrder.\n Error: ${err}`);
      this.error({
        code: err.code === 'invalid_param' ?
          4000 : 1000,
      });
    }
  }
  /**
   * @description 小程序支付回调
   */
  public async payCallBack() {
    console.log('支付回调！！！');
    const { ctx, logger } = this;
    // 是否有安全问题
    const { result_code, out_trade_no, attach } = ctx.request.body;
    let payResult: any = {};

    try {
      if (result_code === 'SUCCESS') {
        payResult = await ctx.service.order.payCallBack.option({
          id: attach.split(',')[0],
          orderId: out_trade_no,
        });
        if (payResult.errorMsg) {
          this.error({
            msg: payResult.errorMsg,
          });
        } else {
          ctx.body = payResult.xml;
        }
      } else {
        logger.error(`======payCallBack 支付失败 result_code:${result_code}, out_trade_no:${out_trade_no}, attach:${attach}`);
      }
    } catch (error) {
      logger.error(`=============payCallBack result_code:${result_code},out_trade_no:${out_trade_no}, attach:${attach}`, error);
    }
  }
}
