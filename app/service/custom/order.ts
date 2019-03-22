'use strict';
/**
 * @description order server
 */

import { Service } from 'egg';
import { concatGenerator, jsonParse } from '../../utils/sqlUtils';

const concatSql = concatGenerator([
  {
  name: 'op_id',
  key: 'op.op_order_id',
  },
  {
    name: 'op_name',
    key: 'op.op_name',
    isString: true,
  },
  {
  name: 'op_number',
  key: 'op.op_number',
  },
  {
  name: 'op_price',
  key: 'op.op_price',
  },
  {
  name: 'op_picture',
  key: 'op.op_picture',
  },
  {
  name: 'op_unit',
  key: 'op.op_unit',
  isString: true,
}]);

export interface OrderList {
  pageSize?: number;
  current?: number;
  state?: number;
  userId?: number;
}

export interface Code {
  code?: number;
  data?: any;
}

export default class MppOrderServer extends Service {
  /**
   * @description 获取订单
   * @param order pageSize: 一页大小 current: 当前页数 state: 订单状态
   */
  public async getList(order: OrderList): Promise<Code> {
    const { ctx, app } = this;
    const { pageSize, current, state, userId } = order;
    const sql = `
        SELECT o.order_id,
              o.order_state,
              o.order_total_price,
              o.order_real_price,
              o.order_create_time,
              o.order_rider_id,
              o.order_send_time,
              o.order_address,
              o.order_message,
              CONCAT('[', GROUP_CONCAT(CONCAT(${concatSql})), ']') AS order_product
        FROM t_order AS o LEFT OUTER JOIN order_product AS op
        ON o.order_id = op.op_order_id
        WHERE o.order_user_id = ?
        AND o.order_state LIKE ?
        GROUP BY o.order_id
        ORDER BY o.order_create_time
        LIMIT ${Number(pageSize)} OFFSET ${Number(pageSize) * (Number(current) - 1)};
      `;
    const where = [
      userId,
      state || '%',
    ];

    try {
      let list = await app.mysql.query(sql, where);
      list = jsonParse(list, 'order_product');
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
      ctx.logger.error(`========小程序：获取订单列表错误 OrderServer.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
