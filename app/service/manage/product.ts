'use strict';
/**
 * @description 货物管理
 */
import { Service } from 'egg';
import { Code } from '../../interface/admin';
import { ProductAddInfo, ProductModifyInfo, ProductCondition } from '../../interface/product';

export default class ProductServer extends Service {
  /**
   * @description 添加商品
   * @param item 描述和图片地址可不传
   */
  public async add(item: ProductAddInfo): Promise<Code> {
    const { ctx, app } = this;
    const { name, price, description, unit, category_id, state, img } = item;

    try {
      const nameErr = await app.mysql.get('product', { product_name: name });
      if (nameErr) {
        return { code: 9100 };
      }
      const info = {
        product_name: name,
        product_price: price,
        product_description: description || '',
        product_unit: unit,
        product_create_time: app.mysql.literals.now,
        product_state: state,
        product_img: img || '',
        product_category_id: category_id,
      };
      const result = await app.mysql.insert('product', info);
      if (result.affectedRows !== 1) {
        return { code: 1000 };
      }
      info.product_create_time = Date();
      return { data: info };
    } catch (err) {
      ctx.logger.error(`========管理端：增加商品失败 ProductServer.add.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 更新信息 或 下架商品
   * @param item 详见ProductModifyInfo interface
   */
  public async modify(item: ProductModifyInfo): Promise<Code> {
    const { ctx, app } = this;
    const { id, name, price, description, unit, state, img, category_id } = item;

    try {
      const product = await app.mysql.get('product', { product_id: id });     
      const nameErr = await app.mysql.get('product', { product_name: name });
      if (!product) return { code: 9101 };
      if (nameErr) return { code: 9102 };

      const info = {
        product_name: name || product.product_name,
        product_price: price || product.product_price,
        product_description: description || product.product_description,
        product_unit: unit || product.product_unit,
        product_category_id: category_id || product.product_category_id,
        product_state: state || product.product_state,
        product_img: img || product.product_img,
      };

      const result = await app.mysql.update('product', info, { where: { product_id: id } });
      if (result.affectedRows !== 1) {
        return { code: 1000 };
      }
      return { data: info };
    } catch (err) {
      ctx.logger.error(`========管理端：修改商品失败 ProductServer.modify.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 获取列表 传入name时候为模糊查询
   * @param condition name 传入时候为查询 不传入返回全部信息
   */
  public async getList(condition: ProductCondition): Promise<Code> {
    const { ctx, app } = this;
    const { name, pageSize, current } = condition;
    const sql = `
    SELECT SQL_CALC_FOUND_ROWS p.*,
    c.category_name
    FROM product as p LEFT OUTER JOIN category as c
    ON c.category_id = p.product_category_id
    ${name ? 'WHERE p.product_name LIKE \'%' + name + '%\'' : ''}
    LIMIT ${Number(pageSize)} OFFSET ${Number(pageSize) * (Number(current) - 1)};
    `;

    try {
      const list = await app.mysql.query(sql);
      const t = await app.mysql.query('SELECT FOUND_ROWS() AS total');
      const total = t[0].total;
      const result = {
        pageSize,
        current,
        total,
        list,
      };
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========管理端：获取商品列表失败 ProductServer.getList.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
}
