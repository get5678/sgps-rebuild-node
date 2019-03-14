'use strict';
/**
 * @description rider Server
 */
import { Service } from 'egg';
import { Code } from '../../interface/admin';
import { Rider, RegisteInfo, UpdateRider, UpdateInfo, SearchCondition, ListCondition } from '../../interface/rider';

export default class RiderServer extends Service {
  /**
   * @description 骑手注册
   * @param rider sex 可以不传入 默认为2(未设置) 0: 男 1: 女
   */
  public async registe(rider: Rider): Promise<Code> {
    const { ctx } = this;
    const { app } = this;

    try {
      const info: RegisteInfo = {
        rider_id: rider.id,
        rider_name: rider.name,
        rider_identity_number: rider.identity_number,
        rider_phone: rider.phone,
        rider_create_time: app.mysql.literals.now,
      };
      if (rider.sex) info.rider_sex = rider.sex;
      const nameErr = await app.mysql.get('rider', { rider_name: rider.name });
      if (nameErr) return { code: 2002 };
      const phoneErr = await app.mysql.get('rider', { rider_phone: rider.phone });
      if (phoneErr) return { code: 2001 };
      const data = await app.mysql.insert('rider', info);
      if (data.affectedRows === 1) {
        return { data: info };
      } else return { code: 1000 };
    } catch (err) {
      ctx.logger.error(`========管理端：骑手列表获取错误 RiderServer.registe.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
  /**
   * @description 更新骑手信息
   * @param rider 有5个可选参数 详见UpdateRider 接口
   */
  public async update(rider: UpdateRider): Promise<Code> {
    const { ctx } = this;
    const { app } = this;

    try {
      const idErr = await app.mysql.get('rider', { rider_id: rider.id });
      if (!idErr) return { code: 2003 };
      const nameErr = await app.mysql.get('rider', { rider_name: rider.name });
      if (nameErr) return { code: 2002 };
      const phoneErr = await app.mysql.get('rider', { rider_phone: rider.phone });
      if (phoneErr) return { code: 2001 };
      const updateInfo: UpdateInfo = {};
      // 未找到合适方法 所以采用if判断 或可先通过id查询到原有信息替代 如name不存在就使用原信息的name
      if (rider.name) updateInfo.rider_name = rider.name;
      if (rider.sex) updateInfo.rider_sex = rider.sex;
      if (rider.identity_number) updateInfo.rider_identity_number = rider.identity_number;
      if (rider.state) updateInfo.rider_state = rider.state;
      const result = await app.mysql.update('rider', updateInfo, {
        where: {
          rider_id: rider.id,
        },
      });
      if (result.affectedRows === 1) {
        return { data: updateInfo };
      } else {
        return { code: 1000 };
      }
    } catch (err) {
      ctx.logger.error(`========管理端：骑手更新信息错误 RiderServer.update.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
  /**
   * @description rider 模糊查询
   * @param condition pageSize current 未传入时候有默认值
   */
  public async search(condition: SearchCondition): Promise<Code> {
    const { ctx } = this;
    const { app } = this;
    const sql = `
    SELECT SQL_CALC_FOUND_ROWS * 
    FROM rider as r
    WHERE r.rider_name LIKE '%${condition.name}%'
    LIMIT ${Number(condition.pageSize)} OFFSET ${Number(condition.pageSize) * (Number(condition.current) - 1)};
    `;
    try {
      const list = await app.mysql.query(sql);
      if (!list.length) return { code: 7000 };
      const total = await app.mysql.query('SELECT FOUND_ROWS() AS total;');
      const realTotal = total[0].total;
      if (Number(condition.pageSize) * (Number(condition.current) - 1) > realTotal) {
        return { code: 7001 };
      }
      const result = {
        pageSize: condition.pageSize,
        current: condition.current,
        total: realTotal,
        list,
      };
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========管理端：骑手查询错误 RiderServer.search.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
  /**
   * @description 删除骑手信息
   * @param id 骑手id
   */
  public async delete(id): Promise<Code> {
    const { ctx } = this;
    const { app } = this;

    try {
      const idErr = await app.mysql.get('rider', { rider_id: id });
      if (!idErr) return { code: 2003 };
      const result = await app.mysql.delete('rider', { rider_id: id });
      if (result.affectedRows === 1) return { data: '删除成功' };
      else return { code: 1000 };
    } catch (err) {
      ctx.logger.error(`========管理端：骑手删除错误 RiderServer.delete.\n Error: ${err}`);
      return { code: 4001 };
    }
  }

  public async getList(condition: ListCondition): Promise<Code> {
    const { ctx } = this;
    const { app } = this;
    const sql = `
    SELECT SQL_CALC_FOUND_ROWS *
    FROM rider as r
    LIMIT ${Number(condition.pageSize)} OFFSET ${Number(condition.pageSize) * (Number(condition.current) - 1)};
    `;

    try {
      const list = await app.mysql.query(sql);
      const total = await app.mysql.query('SELET FOUND_ROWS() AS total;');
      const realTotal = total[0].total;
      if (!list.length) return { code: 7000 };
      if (Number(condition.pageSize) * (Number(condition.current) - 1) > realTotal) {
        return { code: 7001 };
      }
      const result = {
        pageSize: condition.pageSize,
        current: condition.current,
        total: realTotal,
        list,
      };

      return { data: result };
    } catch (err) {
      ctx.logger.error(`========管理端：获取骑手列表错误 RiderServer.getList.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
}
