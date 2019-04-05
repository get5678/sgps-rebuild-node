'use strict';
/**
 * @description coupons server
 */

import { Service } from 'egg';
import { Code } from '../../interface/admin';
import { CouponsAddInfo, CouponsModifyInfo, CouponsCondition } from '../../interface/coupons';

export default class CouponsServer extends Service {
  /**
   * @description 增加优惠券
   * @param item state说明 1: 折扣 2: 减免
   */
  public async add(item: CouponsAddInfo): Promise<Code> {
    const { ctx, app } = this;
    const { type, discount, fill, price, limited_time, state, name } = item;

    try {
      const info = {
        coupons_name: name,
        coupons_type: type,
        coupons_discount: discount || 10,
        coupons_fill: fill || 0,
        coupons_minus: price || 0,
        coupons_limited_time: limited_time,
        coupons_state: state || 1,
        coupons_create_time: app.mysql.literals.now,
      };
      const result = await app.mysql.insert('coupons', info);
      if (result.affectedRows !== 1) {
        return { code: 1000 };
      }
      info.coupons_create_time = Date();
      return { data: info };
    } catch (err) {
      ctx.logger.error(`========管理端：添加优惠券失败 CouponsServer.add.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 修改商品信息
   * @param item
   */
  public async modify(item: CouponsModifyInfo): Promise<Code> {
    const { ctx, app } = this;
    const { id, type, discount, fill, price, limited_time, state, name } = item;

    try {
      const coupons = await app.mysql.get('coupons', { coupons_id: id });
      if (!coupons) {
        return { code: 3003 };
      }
      const info = {
        coupons_name: name || coupons.coupons_name,
        coupons_type: type || coupons.coupons_type,
        coupons_discount: discount || coupons.coupons_discount,
        coupons_fill: fill || coupons.coupons_fill,
        coupons_minus: price || coupons.coupons_price,
        coupons_limited_time: limited_time || coupons.coupons_limited_time,
        coupons_state: state || coupons.coupons_state,
      };
      const result = await app.mysql.update('coupons', info, { where: { coupons_id: id } });
      if (result.affectedRows !== 1) {
        return { code: 1000 };
      }
      return { data: info };
    } catch (err) {
      ctx.logger.error(`========管理端：修改优惠券信息失败 CouponsServer.modify.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * 获取优惠券列表
   * @param co pageSize 与 current 有默认值
   */
  public async getList(co: CouponsCondition): Promise<Code> {
    const { ctx, app } = this;
    const { pageSize, current } = co;
    const sql = `
    SELECT SQL_CALC_FOUND_ROWS *
    FROM coupons
    LIMIT ${Number(pageSize)} OFFSET ${Number(pageSize) * (Number(current) - 1)};
    `;

    try {
      const list = await app.mysql.query(sql);
      const t = await app.mysql.query('SELECT FOUND_ROWS() AS total');
      const total = t[0].total;
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
      ctx.logger.error(`========管理端：获取优惠券列表 CouponsServer.getList.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 获取优惠券详情信息
   * @param id 对应优惠券id
   */
  public async detail(id): Promise<Code> {
    const { ctx, app } = this;

    try {
      const result = await app.mysql.get('coupons', { coupons_id: id });
      if (!result) {
        return { code: 2003 };
      }
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========管理端：获取优惠券列表 CouponsServer.detail.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
}
