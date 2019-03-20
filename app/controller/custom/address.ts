'use strict';
/**
 * @description 小程序 地址接口
 */
import BaseController from '../BaseController';

export default class AddressController extends BaseController {
  /**
   * @description 小程序获取地址
   */
  public async getAddress() {
    const { ctx, logger } = this;
    const { user_id, is_default } = ctx.query;
    // 参数验证规则
    const paramsRule = {
      user_id: { type: 'string', min: 0 },
      is_default: 'string?',
    };

    try {
      // 验证参数
      ctx.validate(paramsRule, ctx.query);

      const result = await ctx.service.custom.address.get({
        user_id,
        is_default,
      });
      this.success(result);
    } catch (error) {
      logger.error(`========${user_id} getAddressList`, error);

      // 判断是否是参数验证错误
      this.error({
        code: error.code === 'invalid_param' ?
          4000 : null,
      });
    }
  }

  /**
   * @description 小程序上传地址
   */
  public async postAddress() {
    const { ctx, logger } = this;
    const {
      user_id,
      address_id,
      name,
      building,
      room,
      phone,
      is_default,
      address_sex,
    } = ctx.request.body;
    if (address_id) {
      return this.patchAddress();
    }
    const paramsRule = {
      address_id: 'int?',
      user_id: { type: 'number', min: 0 },
      name: 'string',
      building: 'int',
      room: 'string',
      phone: 'string',
      is_default: [ 0, 1 ],
      address_sex: [ 0, 1 ],
    };

    try {
      // 验证参数
      ctx.validate(paramsRule);
      // 如果为默认地址则修改之前的默认地址
      if (is_default === 1) {
        await ctx.service.custom.address.change({ user_id });
      }
      const result: any = await ctx.service.custom.address.post({
        user_id,
        address_id,
        name,
        building,
        room,
        phone,
        is_default,
        address_sex,
      });
      if (result.errorMsg) return this.error(result);
      this.success(result);
    } catch (error) {
      logger.error(`======${user_id} optionAddress`, error);

      // 判断是否是参数验证错误
      this.error({
        code: error.code === 'invalid_param' ?
          4000 : null,
      });
    }
  }

  /**
   * @description 小程序更新地址
   */
  public async patchAddress() {
    const { ctx, logger } = this;
    const {
      user_id,
      address_id,
      name,
      building,
      room,
      phone,
      is_default,
      address_sex,
    } = ctx.request.body;
    // 参数规则
    // 参数验证规则
    const postAndPatchRule = {
      user_id: { type: 'number', min: 0 },
      name: 'string',
      building: 'int?',
      room: 'string',
      phone: 'string',
      is_default: [ 0, 1 ],
      address_sex: [ 0, 1 ],
    };
    const paramsRule = {
      ...postAndPatchRule,
      address_id: 'int?',
    };

    try {
      // 验证参数
      ctx.validate(paramsRule);
      if (is_default === 1) {
        await ctx.service.custom.address.change({
          user_id,
        });
      }

      const result = await ctx.service.custom.address.patch({
        address_id,
        name,
        building,
        room,
        phone,
        is_default,
        address_sex,
      });
      if (!result) {
        this.error({
          code: 4000,
        });
        return;
      }
      this.success(result);
    } catch (error) {
      logger.error(`======${user_id} patchAddress`, error);
      this.error({
        code: error.code === 'invalid_param' ?
          4000 : null,
      });
    }
  }

  /**
   * @description 小程序删除地址
   */
  public async deleteAddress() {
    const { ctx, logger } = this;
    const {
      address_id,
    } = ctx.request.body;
    // 参数规则
    const paramsRule = {
      address_id: { type: 'int', min: 0 },
    };

    try {
      // 参数验证
      ctx.validate(paramsRule);
      const result = await ctx.service.custom.address.delete({ address_id });
      if (result) {
        this.success(result);
      } else {
        this.error({
          code: 4000,
        });
      }
    } catch (error) {
      logger.error(`======${address_id} address 删除地址`, error);

      this.error({
        code: error.code === 'invalid_param' ?
          4000 : null,
      });
    }
  }

  /**
   * @description 小程序获取楼栋地址
   */
  public async getBuilding() {
    const { ctx, logger } = this;
    // 参数规则
    // const paramsRule = {
    //   building_univer: { type: 'string' },
    // };

    try {
      // 参数验证
      // ctx.validate(paramsRule, ctx.query);
      const result = await ctx.service.custom.address.getBuilding();
      console.log('result', result);
      this.success(result);
    } catch (error) {
      logger.error('========getAddressList', error);

      // 判断是否是参数验证错误
      this.error({
        code: error.code === 'invalid_param' ?
          4000 : null,
      });
    }
  }
}
