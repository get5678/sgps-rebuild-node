'use strict';
/**
 * @description order server
 */

import { Service } from 'egg';
import { OrderList } from '../../interface/order';
import { Code } from '../../interface/admin';

export default class OrderServer extends Service {
  /**
   * @description 获取订单
   * @param order pageSize: 一页大小 current: 当前页数
   */
  public async getList(order: OrderList): Promise<Code> {
    const { ctx, app } = this;
    const { pageSize, current, type } = order;
    const sql = `
    SELECT * FROM ${'`order`'}
    ${type ? 'WHERE order.order_state = ' + type : ''}
    LIMIT ${Number(pageSize)} OFFSET ${Number(pageSize) * (Number(current) - 1)};
    `;
    
    try {
      const list = await app.mysql.query(sql);
      const total = list.length;
      if (Number(pageSize) * (Number(current) - 1) > total) {
        return { code: 7001 };
      }
      const result = {
        pageSize,
        current,
        total,
        list,
      };
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========管理端：获取订单列表错误 OrderServer.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
