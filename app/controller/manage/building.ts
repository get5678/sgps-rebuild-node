'use strict';
/**
 * @description building controller
 */

import BaseController from '../BaseController';
// validate data
const ListInfo = {
  pageSize: 'number?',
  current: 'number?',
};

const ModifyInfo = {
  id: 'number',
  name: 'string?',
  is_open: 'number?',
};

const AddInfo = {
  id: 'number',
  name: 'string',
  is_open: 'number',
};

export default class BuildingController extends BaseController {
  /**
   * @description 获取用户列表
   */
  public async getList() {
    const { ctx } = this;
    const { pageSize = 5, current = 1 } = ctx.query;

    try {
      ctx.validate(ListInfo);
      const result = await ctx.service.manage.building.getList({ pageSize, current });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：获取楼栋信息失败 BuildingController.getList.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 修改楼栋信息
   */
  public async modify() {
    const { ctx } = this;

    try {
      ctx.validate(ModifyInfo);
      const result = await ctx.service.manage.building.modify(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：获取楼栋信息失败 BuildingController.modify.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
  /**
   * @description 添加楼栋
   */
  public async add() {
    const { ctx } = this;

    try {
      ctx.validate(AddInfo);
      const result = await ctx.service.manage.building.add(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：获取楼栋信息失败 BuildingController.add.\n Error: ${err}`);
      return { code: 4000 };
    }
  }
}
