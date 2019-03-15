'use strict';
/**
 * @description category Server
 */

import { Service } from 'egg';
import { Code } from '../../interface/admin';
import { CategoryAdd, CategoryModify, ModifyInfo, Condition } from '../../interface/category';

export default class CategoryServer extends Service {
  /**
   * @description 添加商品种类
   * @item item.id: 商品id item.name: 商品种类名称
   */
  public async add(item: CategoryAdd): Promise<Code> {
    const { ctx, app } = this;

    try {
      const nameErr = await app.mysql.get('category', { category_name: item.name });
      if (nameErr) {
        return { code: 8000 };
      }
      const info = {
        category_name: item.name,
        category_create_time: app.mysql.literals.now,
      };
      const result = await app.mysql.insert('category', info);
      if (result.affectedRows === 1) {
        return { data: info };
      } else {
        return { code: 1000 };
      }
    } catch (err) {
      ctx.logger.error(`========管理端：添加商品种类失败 CategoryServer.add.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 修改商品种类信息
   * @param item item.id: 商品id item.name: 商品种类修改名称 item.state 商品种类状态 item.is_delete 商品是否删除
   */
  public async modify(item: CategoryModify): Promise<Code> {
    const { ctx, app } = this;

    try {
      if (item.name) {
        const nameErr = await app.mysql.get('category', { category_name: item.name });
        if (nameErr) {
          return { code: 8000 };
        }
      }
      const info: ModifyInfo = {};
      if (item.name) info.category_name = item.name;
      if (item.is_delete !== undefined) info.category_is_delete = item.is_delete;
      if (item.state !== undefined) info.category_state = item.state;
      const result = await app.mysql.update('category', info, { where: { category_id: item.id } });
      if (result.affectedRows === 1) {
        const data = await app.mysql.get('category', { category_id: item.id });
        return { data };
      } else {
        return { code: 1000 };
      }
    } catch (err) {
      ctx.logger.error(`========管理端：修改商品种类信息失败 CategoryServer.update.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 不传入name时候 获取全部列表 传入name时为模糊查询 
   * @param condition condition.pageSize 一页大小(默认为5) condition.current 当前页数(默认为1) condition.name 搜索查询关键字
   */
  public async search(condition: Condition): Promise<Code> {
    const { ctx, app } = this;
    const { current, pageSize, name } = condition;
    const sql = `
    SELECT c.category_id,
    c.category_name,
    c.category_state,
    c.category_is_delete,
    c.category_create_time
    FROM category as c
    ${name ? 'WHERE c.category_name LIKE \'%' + name + '%\'' : ''}
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
      ctx.logger.error(`========管理端：修改商品种类信息失败 CategoryServer.search.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
}
