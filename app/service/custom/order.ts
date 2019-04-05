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
    isString: true,
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

export interface ModifyInfo {
  userId: number;
  orderId: number;
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
        SELECT SQL_CALC_FOUND_ROWS
              o.order_id,
              o.order_state,
              o.order_total_price,
              o.order_real_price,
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
      console.log('@@@@');
      let list = await app.mysql.query(sql, where);
      console.log('@@@@@');
      list = jsonParse(list, 'order_product');
      console.log('@');
      const totalData = await app.mysql.query('SELECT FOUND_ROWS() AS total;');
      console.log('@@');
      const total = totalData[0].total;
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
  /**
   * @description 小程序修改订单状态
   * @param info userId 用户ID orderId 订单ID
   */
  public async ModOrder(info: ModifyInfo) {
    const { ctx, app } = this;
    const { userId, orderId } = info;

    try {
      const list = await app.mysql.select('t_order', {
        where: {
          order_id: orderId,
          order_user_id: userId,
        },
        columns: [ 'order_state' ],
      });
      const state = list[0].order_state;
      if (state) {
        const result = await this.app.mysql.update('t_order', {
          order_state: 4,
        }, {
          where: {
            order_id: orderId,
            order_user_id: userId,
          },
        });
        if (result.affectedRows === 1) {
          return { data: '修改订单状态成功' };
        }
        return { code: 5100 };
      }
      return { code: 1000 };
    } catch (err) {
      ctx.logger.error(`========小程序：调整订单状态错误 MppOrderServer.ModOrder.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
  /**
   * @description 小程序获取订单详情
   * @param ModInfo userId 用户ID orderId 订单ID
   */
  public async getOrderDetail(info: ModifyInfo) {
    const { ctx, app } = this;
    const { userId, orderId } = info;
    const sql = `
        SELECT SQL_CALC_FOUND_ROWS
              o.order_id,
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
        AND o.order_id = ?;
      `;
    try {
      let list = await app.mysql.query(sql, [ userId, orderId ]);
      list = jsonParse(list, 'order_product');
      const result = {
        list,
      };
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========小程序：获得订单详情 MppOrderServer.getOrderDetail.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
