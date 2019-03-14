'use strict';
/**
 * @description rider Controller 
 */
import BaseController from '../BaseController';

const RegisteInfo = {
  id: 'number',
  name: 'string?',
  sex: 'number?',
  phone: 'string?',
  identity_number: 'string?',
};

const UpdateInfo = {
  id: 'number',
  name: 'string?',
  sex: 'number?',
  phone: 'string?',
  identity_number: 'string?',
  state: 'number?',
};

const SearchInfo = {
  pageSize: 'number?',
  current: 'number?',
  name: 'string?',
};

const DeleteInfo = {
  id: 'number',
};

const GetListInfo = {
  pageSize: 'number?',
  current: 'number?',
};

export default class RiderController extends BaseController {
  /**
   * @description 注册(将用户变为骑手)
   */
  public async registe() {
    const { ctx } = this;

    try {
      ctx.validate(RegisteInfo);
      const result = await ctx.service.manage.rider.registe(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：注册出现错误 RiderController.registe.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
  /**
   * @description 更新骑手信息或冻结(解冻)骑手
   */
  public async update() {
    const { ctx } = this;

    try {
      ctx.validate(UpdateInfo);
      const result = await ctx.service.manage.rider.update(ctx.request.body);
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：注册出现错误 RiderController.registe.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
  /**
   * @description 搜索
   */
  public async search() {
    const { ctx } = this;
    const { pageSize = 5 } = ctx.query;
    const { current = 1 } = ctx.query;
    const { name } = ctx.query;

    try {
      ctx.validate(SearchInfo);
      const result = await ctx.service.manage.rider.search({ pageSize, current, name });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：搜索出现错误 RiderController.search.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
  /**
   * @description 根据rider id 删除rider
   */
  public async delete() {
    const { ctx } = this;
    const { id } = ctx.query;

    try {
      ctx.validate(DeleteInfo);
      const result = await ctx.service.manage.rider.delete({ id });
      if (result && result.code) {
        return this.error(result.code);
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：删除出现错误 RiderController.delete.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
  /**
   * @description 获取rider列表展示
   */
  public async getList() {
    const { ctx } = this;
    const { pageSize = 5 } = ctx.query;
    const { current = 1 } = ctx.query;

    try {
      ctx.validate(GetListInfo);
      const result = await ctx.service.manage.rider.getList({ pageSize, current });
      if (result && result.code) {
        return this.error({ code: result.code });
      }
      return this.success(result.data);
    } catch (err) {
      ctx.logger.error(`========管理端：获取骑手列表出现错误 RiderController.getList.\n Error: ${err}`);
      return { code: 4001 };
    }
  }
}
