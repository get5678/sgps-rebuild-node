'use strict';
/**
 * @description order server
 */

import { Service } from 'egg';

export interface List {
  pageSize?: number;
  current?: number;
  userId?: number;
}

export default class MppCouponsServer extends Service {
  /**
   * @description 小程序获取优惠券列表
   * @param GetListInfo pageSize 一页大小 current 当前页数 userId 用户ID
   */
  public async getList(list: List) {
    const { ctx, app } = this;
    const { pageSize, current, userId } = list;
    const sql = `
      SELECT SQL_CALC_FOUND_ROWS
        c.coupons_name,
        c.coupons_type,
        c.coupons_discount,
        c.coupons_fill,
        c.coupons_price,
        c.coupons_state,
        cu.cu_code
      FROM
        coupons_user AS cu
        LEFT OUTER JOIN coupons AS c ON cu.cu_coupons_id = c.coupons_id
      WHERE
        cu.cu_user_id = ?
      LIMIT ${Number(pageSize)} OFFSET ${Number(pageSize) * (Number(current) - 1)};
    `;

    try {
      const list = await app.mysql.query(sql, [ userId ]);
      const totalData = await app.mysql.query('SELECT FOUND_ROWS() AS total;');
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
      ctx.logger.error(`========小程序：获取优惠券列表错误 MppCouponsServer.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
