'use strict';

/**
 *
 * @desc 小程序 根据用户获取收货地址列表 service
 *
 */
import { Service } from 'egg';

interface Info {
  user_id?: number;
  name?: string;
  building?: number;
  room?: string;
  phone?: string;
  address_sex?: [0, 1];
  is_default?: [ 0, 1 ];
  address_id?: number;
}

interface DeleteInfo {
  address_id: number;
}

export default class AddressService extends Service {
  /**
   * @description 根据用户获取收货地址列表
   */
  public async get({ user_id, is_default }) {
    const { logger, app } = this;
    let addressList = [];
    const where = [
      user_id,
      is_default || '%',
    ];

    try {
      const sql = `
    SELECT
      ua.*,
      b.building_name
    FROM
      address AS ua
      LEFT OUTER JOIN building AS b ON ua.address_building_id = b.building_id
    WHERE
      ua.address_user_id = ?
      AND ua.address_is_default LIKE ?;
      `;
      addressList = await app.mysql.query(sql, where);
    } catch (error) {
      logger.error(`=========${user_id} getAddressListError`, error);
      throw error;
    }

    return {
      addressList,
    };
  }

  /**
   * @description 新增用户地址
   */
  public async post(param: Info) {
    const { logger } = this;
    const {
      user_id,
      name,
      building,
      room,
      phone,
      address_sex,
      is_default,
    } = param;

    try {
      // 判断之前用户是否有地址
      const already = await this.app.mysql.select('address', {
        where: { address_user_id: user_id },
      });
      const result = await this.app.mysql.insert('address', {
        address_user_id: user_id,
        address_name: name,
        address_building_id: building,
        address_room: room,
        address_phone: phone,
        address_is_default: already.length === 0 ? 1 : is_default,
        address_sex,
      });
      if (result.affectedRows === 1) {
        return '新增地址成功';
      }
      return {
        errorMsg: '新增地址失败',
      };
    } catch (err) {
      logger.error(`=====${user_id} address 新增地址`, err);
      return {
        errorMsg: '新增地址失败',
      };
    }
  }

  /**
   * @description 更新用户地址
   */
  public async patch(params: Info) {
    const { logger } = this;
    const {
      address_id,
      name,
      building,
      room,
      phone,
      address_sex,
      is_default,
    } = params;

    try {
      // 判断是否存在该地址
      const already = await this.app.mysql.select('address', {
        where: { address_id },
      });
      if (already.length === 0) {
        return false;
      }
      const options = {
        where: {
          address_id,
        },
      };
      const result = await this.app.mysql.update('address', {
        address_name: name,
        address_building_id: building,
        address_room: room,
        address_phone: phone,
        address_sex,
        address_is_default: is_default,
      }, options);
      return result.affectedRows === 1 ? '更新成功' : false;
    } catch (error) {
      logger.error(`======${address_id} address 更新地址`, error);
      throw error;
    }
  }

  /**
   * @description 小程序删除地址
   */
  public async delete(params: DeleteInfo) {
    const { logger, app } = this;
    const {
      address_id,
    } = params;
    let result: any;

    try {
      result = await app.mysql.delete('address', {
        address_id,
      });

    } catch (error) {
      logger.error(`======${address_id} address 删除地址`, error);
      throw error;
    }
    console.log('result', result);

    return result.affectedRows === 1 ? '删除成功' : false;
  }

  /**
   * @description 小程序获取楼栋列表
   */
  public async getBuilding() {
    const { logger, app } = this;
    let buildingList = [];
    const where = {
      building_is_open: 1,
    };

    try {
      buildingList = await app.mysql.select(
        'building',
        {
          where,
          columns: [ 'building_id', 'building_name' ],
        },
      );
      console.log('building_univer', buildingList);
    } catch (error) {
      logger.error('======getBuildingListError', error);
      throw error;
    }
    return {
      buildingList,
    };
  }

  /**
   * @description 小程序改更默认地址
   */
  public async change({ user_id: address_user_id }) {
    const { app, logger } = this;
    const addressId: any = [];
    try {
      const result = await app.mysql.select('address', {
        where: {
          address_user_id,
          address_is_default: 1,
        },
        columns: [ 'address_id' ],
      });
      result.forEach((item: { address_id: number; }) => {
        addressId.push(item.address_id);
      });
      if (result.length === 0) return false;
      const resultF = await app.mysql.update('address', {
        address_is_default: 0,
      }, {
        where: {
          address_id: addressId,
        },
      });
      return resultF.affectedRows === 1;
    } catch (error) {
      logger.error(`======${address_user_id} address 更改默认地址`, error);
      throw error;
    }
  }
}
