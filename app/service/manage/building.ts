'use strict';
/**
 * @description 楼栋管理
 */

import { Service } from 'egg';
import { Code } from '../../interface/admin';
import { Condition, AddInfo, ModifyInfo, UpdateInfo } from '../../interface/building';

export default class BuildingServer extends Service {
  /**
   * @description 获取楼栋列表
   * @param condition pageSize 一页大小 current 当前页数
   */
  public async getList(condition: Condition): Promise<Code> {
    const { app, ctx } = this;
    const { pageSize, current } = condition;

    try {
      const list = await app.mysql.select('building', {
        limit: Number(pageSize),
        offset: Number(pageSize) * (Number(current) - 1),
      });
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
      ctx.logger.error(`========管理端：获取楼栋列表错误 BuildingServer.getList.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 添加楼栋信息
   * @param item id: 楼栋id 对应多少栋 name: 楼栋名称 is_open: 1: 开放 0: 未开放
   */
  public async add(item: AddInfo): Promise<Code> {
    const { app, ctx } = this;
    const { id, name, is_open } = item;

    try {
      const idErr = await app.mysql.get('building', { building_id: id });
      if (idErr) {
        return { code: 9001 };
      }
      const info = {
        building_id: id,
        building_name: name,
        building_is_open: is_open || 1,
      };
      const result = await app.mysql.insert('building', info);
      if (result.affectedRows === 1) {
        return { data: info };
      } else return { code: 1000 };
    } catch (err) {
      ctx.logger.error(`========管理端：添加楼栋信息失败 BuildingServer.add.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 修改楼栋信息(冻结楼栋)
   * @param item id: 根据id修改 name: 修改楼栋名称 is_open: 修改楼栋状态
   */
  public async modify(item: ModifyInfo): Promise<Code> {
    const { app, ctx } = this;
    const { id, name, is_open } = item;

    try {
      const nameErr = await app.mysql.get('building', { building_name: name });
      if (nameErr) {
        return { code: 9002 };
      }
      const info: UpdateInfo = {};
      if (name) info.building_name = name;
      if (is_open !== undefined) info.building_is_open = is_open;
      const result = await app.mysql.update('building', info, { where: { building_id: id } });
      if (result.affectedRows === 1) {
        return { data: '修改成功' };
      } else return { code: 1000 };
    } catch (err) {
      ctx.logger.error(`========管理端：修改楼栋信息失败 BuildingServer.modify.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
}
