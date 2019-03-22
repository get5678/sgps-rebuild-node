'use strict';
/**
 * @description mpp product server
 */

import { Service } from 'egg';
import { concatGenerator, jsonParse } from '../../utils/sqlUtils';

const concatSql = concatGenerator([
  {
  name: 'product_id',
  key: 'p.product_id',
  },
  {
    name: 'product_name',
    key: 'p.product_name',
    isString: true,
  },
  {
  name: 'product_price',
  key: 'p.product_price',
  },
  {
  name: 'product_description',
  key: 'p.product_description',
  isString: true,
  },
  {
  name: 'product_unit',
  key: 'p.product_unit',
  isString: true,
  },
  {
    name: 'product_img',
    key: 'p.product_img',
    isString: true,
}]);

export interface List {
  pageSize?: number;
  current?: number;
  name?: string;
  category_id?: number | string;
}

export interface Code {
  code?: number;
  data?: any;
}

export default class MppProductServer extends Service {
  /**
   * @description 获取商品列表
   * @param list pageSize: 一页大小 current: 当前页数 categoryId 商品种类 name 商品名
   */
  public async getList(list: List): Promise<Code> {
    const { ctx, app } = this;
    const { pageSize, current, category_id } = list;

    const sql = `
    SELECT
      c.category_name,
      CONCAT('[', GROUP_CONCAT(CONCAT(${concatSql})), ']') AS product
    FROM
      product_category pc
      LEFT OUTER JOIN category c ON pc.pc_category_id = c.category_id
      LEFT OUTER JOIN product p ON p.product_id = pc.pc_product_id
    WHERE
      c.category_id LIKE ?
    GROUP BY c.category_name;
    `;
    const where = [
      category_id || '%',
    ];

    try {
      let list = await app.mysql.query(sql, where);
      list = jsonParse(list, 'product');
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
      ctx.logger.error(`========小程序：获取商品列表错误 MppProductServer.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }

  /**
   * @description 小程序商品模糊查询
   * @param name 查询名
   */
  public async search(name: string): Promise<Code> {
    const { ctx, app } = this;
    name = name + '%';
    const sql = `
    SELECT
      p.product_id,
      p.product_name,
      p.product_price,
      p.product_description,
      p.product_unit,
      p.product_img
    FROM
      product p
    WHERE
      p.product_name LIKE ?;
    `;

    try {
      const list = await app.mysql.query(sql, [ name ]);
      const total = list.length;
      const result = {
        total,
        list,
      };
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========小程序：搜索商品列表错误 MppProductServer.search.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
