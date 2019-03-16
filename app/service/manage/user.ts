'use strict';

/**
 *  @description manage user server
 */

import { Service } from 'egg';
import { UserUpdate, UserUpdateInfo, SearchInfo } from '../../interface/user';
import { Code, List } from '../../interface/admin';

export default class UserServer extends Service {
  /**
   * @description 获取用户列表
   */
  public async getList(listInfo: List): Promise<Code> {
    const { ctx, app } = this;
    const sql = `
    SELECT
    u.user_id,
    u.user_name,
    u.user_phone,
    u.user_sex,
    u.user_create_time,
    b.building_name
    FROM user as u LEFT JOIN adresss as a
    ON u.user_id = a.adress_user_id
    LEFT JOIN building as b
    ON b.building_id = a.adress_building_id
    LIMIT ${Number(listInfo.pageSize)}
    OFFSET ${Number(listInfo.pageSize) * (Number(listInfo.current) - 1)};
    `;

    try {
      const list = await app.mysql.query(sql);
      const total = list.length;
      if (Number(listInfo.pageSize) * (Number(listInfo.current) - 1) > total) {
        return { code: 7001 };
      }
      if (!total) {
        return { code: 7000 };
      }
      for (const item of list) {
        delete item.user_open_id;
        delete item.user_union_id;
      }
      const result = {
        data: {
          pageSize: listInfo.pageSize,
          current: listInfo.current,
          total,
          list,
        },
      };
      return result;
    } catch (err) {
      ctx.logger.error(`========管理端：用户列表获取错误 AdminServer.logout.\n Error: ${err}`);
      return { code: -1 };
    }
  }
  /**
   * @description 修改用户信息
   * @param user UserUpdate 类型
   */
  public async update(user: UserUpdate): Promise<Code> {
    const { ctx, app } = this;

    try {
      const idErr = await app.mysql.get('user', { user_id: user.id });
      if (!idErr) {
        return { code: 2003 };
      }
      const userInfo: UserUpdateInfo = {};
      if (user.phone) {
        const pErr = await app.mysql.get('user', { user_phone: user.phone });
        if (pErr) {
          return { code: 2002 };
        } else userInfo.user_phone = user.phone;
      }
      if (user.name) userInfo.user_name = user.name;
      if (user.hasOwnProperty('sex')) userInfo.user_sex = user.sex;
      else return { code: 4000 };

      const result = await app.mysql.update('user', userInfo, { where: { user_id: user.id } });
      if (result.affectedRows === 1) {
        return { data: '修改成功' };
      } else return { code: 1000 };
    } catch (err) {
      ctx.logger.error(`========管理端：用户数据修改错误 AdminServer.logout.\n Error: ${err}`);
      return { code: -1 };
    }
  }
  /**
   * @description 查询
   * @param search SearchInfo类型
   */
  public async search(search: SearchInfo): Promise<Code> {
    const { ctx, app } = this;
    const sql = `
    SELECT u.user_id,
    u.user_name,
    u.user_phone,
    u.user_sex,
    u.user_create_time,
    b.building_name
    FROM user as u LEFT JOIN adresss as a
    ON u.user_id = a.adress_user_id
    LEFT JOIN building as b
    ON b.building_id = a.adress_building_id
    ${search.building ? 'WHERE b.building_id  LIKE ' + '\'%' + search.building + '%\'' : ''}
    ${(search.building && search.name) ? 'AND u.user_name LIKE ' + '\'%' + search.name + '%\'' : ''}
    ${(!search.building && search.name) ? 'WHERE u.user_name LIKE ' + '\'%' + search.name + '%\'' : ''}
    LIMIT ${Number(search.pageSize)}
    OFFSET ${Number(search.pageSize) * (Number(search.current) - 1)};
    `;

    try {
      const list = await app.mysql.query(sql);
      const total = list.length;
      if (!list.length) {
        return { code: 5001 };
      }
      const result = {
        data: {
          pageSize: search.pageSize,
          current: search.current,
          total,
          list,
        },
      };

      return result;
    } catch (err) {
      ctx.logger.error(`========管理端：用户查询失败 AdminServer.logout.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
}
