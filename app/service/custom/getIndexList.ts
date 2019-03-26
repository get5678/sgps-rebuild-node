'use strict';
/**
 * @description 小程序 首页商品列表
 */

import { Service } from 'egg';

export interface List {
  pageSize?: number;
  current?: number;
}

export interface Code {
  code?: number;
  data?: any;
}

export default class GetIndexListService extends Service {
  /**
   * @description 获取订单
   * @param list pageSize: 一页大小 current: 当前页数
   */
  public async getList(list: List): Promise<Code> {
    const { ctx, app } = this;
    const { pageSize, current } = list;
    const sql = `
    SELECT SQL_CALC_FOUND_ROWS
    p.*,
    c.category_name
    FROM product as p LEFT OUTER JOIN category as c
    ON c.category_id = p.product_category_id
    LIMIT ${Number(pageSize)} OFFSET ${Number(pageSize) * (Number(current) - 1)};
    `;

    try {
      const list = await app.mysql.query(sql);
      const totalData = await app.mysql.query('SELECT FOUND_ROWS() AS total;');
      const total = totalData[0].total;
      const result = {
        pageSize,
        current,
        total,
        list,
      };
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========小程序：获取首页商品列表错误 GetIndexListService.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
