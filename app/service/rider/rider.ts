'use strict';

/**
 * @description 小程序 banner service
 */

import { Service } from 'egg';
import { concatGenerator, jsonParse } from '../../utils/sqlUtils';

const concatSql = concatGenerator([
  {
  name: 'op_id',
  key: 'op.op_id',
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
  name: 'op_picture',
  key: 'op.op_picture',
  isString: true,
  },
  {
  name: 'op_unit',
  key: 'op.op_unit',
  isString: true,
}]);

export interface Code {
  code?: number;
  data?: any;
}

export interface OrderList {
  pageSize?: number;
  current?: number;
  state?: number;
  riderId?: number;
}

export interface ModifyInfo {
  riderId: number;
  orderId: number;
  state: number;
}

export default class RiderService extends Service {
  /**
   * @description 获取骑手订单
   * @param order pageSize: 一页大小 current: 当前页数 state: 订单状态
   */
  public async getList(order: OrderList): Promise<Code> {
    const { ctx, app } = this;
    const { pageSize, current, state, riderId } = order;
    const sql = `
        SELECT SQL_CALC_FOUND_ROWS
              o.order_id,
              o.order_state,
              o.order_send_time,
              o.order_address,
              o.order_message,
              o.order_create_time,
              CONCAT('[', GROUP_CONCAT(CONCAT(${concatSql})), ']') AS order_product
        FROM t_order AS o LEFT OUTER JOIN order_product AS op
        ON o.order_id = op.op_order_id
        WHERE o.order_rider_id = ?
        AND o.order_state LIKE ?
        GROUP BY o.order_id
        ORDER BY o.order_create_time
        LIMIT ${Number(pageSize)} OFFSET ${Number(pageSize) * (Number(current) - 1)};
      `;
    const where = [
      riderId,
      state || '%',
    ];

    const conn = await app.mysql.beginTransaction(); // 初始化事务

    try {
      let list = await conn.query(sql, where);
      list = jsonParse(list, 'order_product');
      const totalData = await conn.query('SELECT FOUND_ROWS() AS total;');
      const total = totalData[0].total;

      await conn.commit();

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
      await conn.rollback();
      ctx.logger.error(`========小程序：获取骑手订单 RiderService.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
  /**
   * @description 小程序修改订单状态
   * @param info riderId 骑手ID orderId 订单ID
   */
  public async ModOrder(info: ModifyInfo) {
    const { ctx, app } = this;
    const { riderId, orderId, state } = info;

    try {
      const list = await app.mysql.select('t_order', {
        where: {
          order_id: orderId,
          order_rider_id: riderId,
        },
        columns: [ 'order_state' ],
      });
      const orderState = list[0].order_state;
      if (orderState) {
        const result = await app.mysql.update('t_order', {
          order_state: state,
        }, {
          where: {
            order_id: orderId,
            order_rider_id: riderId,
          },
        });
        if (result.affectedRows === 1) {
          return { data: '修改订单状态成功' };
        }
        return { code: 5100 };
      }
      return { code: 5000 };
    } catch (err) {
      ctx.logger.error(`========小程序：骑手订单状态错误 RiderController.ModOrder.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
