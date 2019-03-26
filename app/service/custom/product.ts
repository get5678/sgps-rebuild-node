'use strict';
/**
 * @description mpp product server
 */

import { Service } from 'egg';

export interface List {
  pageSize?: number;
  current?: number;
  name?: string;
  category_id: number;
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
    SELECT SQL_CALC_FOUND_ROWS
      p.product_id,
      p.product_name,
      p.product_price,
      p.product_description
    FROM
      product_category pc
      LEFT OUTER JOIN category c ON pc.pc_category_id = c.category_id
      LEFT OUTER JOIN product p ON p.product_id = pc.pc_product_id
    WHERE
      c.category_id LIKE ?
      AND p.product_state = 1;
    `;
    const where = [
      category_id,
    ];

    try {
      const species = await app.mysql.select('category', {
        where: { category_id },
        columns: [ 'category_name' ],
      });
      const list = await app.mysql.query(sql, where);
      const totalData = await app.mysql.query('SELECT FOUND_ROWS() AS total;');
      const total = totalData[0].total;
      if (Number(pageSize) * (Number(current) - 1) > total) {
        return { code: 7001 };
      }
      const result = {
        pageSize,
        current,
        total,
        species,
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
    SELECT SQL_CALC_FOUND_ROWS
      p.product_id,
      p.product_name,
      p.product_price,
      p.product_description,
      p.product_unit,
      p.product_img
    FROM
      product p
    WHERE
      p.product_name LIKE ?
      AND p.product_state = 1;
    `;

    try {
      const list = await app.mysql.query(sql, [ name ]);
      const totalData = await app.mysql.query('SELECT FOUND_ROWS() AS total;');
      const total = totalData[0].total;
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
  /**
   * @description 小程序获得商品种类
   */
  public async getSpecies(): Promise<Code> {
    const { ctx, app } = this;

    try {
      const result = await app.mysql.select('category', {
        where: { category_state: 1 },
        columns: [ 'category_id', 'category_name' ],
      });
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========小程序：搜索商品列表错误 MppProductServer.getSpecies.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
  /**
   * @description 获取商品详情
   * @param product_id 商品ID
   */
  public async getDetail(product_id: number): Promise<Code> {
    const { ctx, app } = this;

    try {
      const result = await app.mysql.select('product', {
        where: { product_id },
        columns: [ 'product_id', 'product_name', 'product_price', 'product_description', 'product_unit', 'product_img' ],
      });
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========小程序：获取商品详情 MppProductServer.getDetail.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
