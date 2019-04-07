'use strict';
/**
 * @description order server
 */

import { Service } from 'egg';
import { concatGenerator, jsonParse } from '../../utils/sqlUtils';
import * as uuidV1 from 'uuid/v1';

const concatSql = concatGenerator([
  {
  name: 'op_id',
  key: 'op.op_id',
  },
  {
    name: 'op_name',
    key: 'op.op_name',
    isString: true,
  },
  {
    name: 'op_number',
    key: 'op.op_number',
  },
  {
    name: 'op_price',
    key: 'op.op_price',
  },
  {
    name: 'op_picture',
    key: 'op.op_picture',
    isString: true,
  },
  {
    name: 'op_unit',
    key: 'op.op_unit',
    isString: true,
}]);

export interface OrderList {
  pageSize: number;
  current: number;
  state?: number;
  userId: number;
}

export interface Code {
  code?: number;
  data?: any;
}

export interface ModifyInfo {
  userId: number;
  orderId: number;
  state: number;
}

export interface GetOrderDetail {
  userId: number;
  orderId: number;
}

export interface Order {
  userId: number;
  order_product: [{
    product_id: number,
    product_num: number,
    product_name?: string,
    product_unit?: string,
    product_price?: string | number,
    product_img?: string,
  }];
  order_send_time: string;
  order_total_price: number;
  order_address_id: number;
  order_coupons_code?: number | string;
  order_message?: string;
  openId: string;
}

export default class MppOrderServer extends Service {
  /**
   * @description 获取订单
   * @param order pageSize: 一页大小 current: 当前页数 state: 订单状态
   */
  public async getList(order: OrderList): Promise<Code> {
    const { ctx, app } = this;
    const { pageSize, current, state, userId } = order;
    const sql = `
        SELECT SQL_CALC_FOUND_ROWS
              o.order_id,
              o.order_state,
              o.order_total_price,
              o.order_real_price,
              CONCAT('[', GROUP_CONCAT(CONCAT(${concatSql})), ']') AS order_product
        FROM t_order AS o LEFT OUTER JOIN order_product AS op
        ON o.order_id = op.op_order_id
        WHERE o.order_user_id = ?
        AND o.order_state LIKE ?
        GROUP BY o.order_id
        ORDER BY o.order_create_time
        LIMIT ${Number(pageSize)} OFFSET ${Number(pageSize) * (Number(current) - 1)};
      `;
    const where = [
      userId,
      state || '%',
    ];

    try {
      console.log('@@@@');
      let list = await app.mysql.query(sql, where);
      console.log('@@@@@');
      list = jsonParse(list, 'order_product');
      console.log('@');
      const totalData = await app.mysql.query('SELECT FOUND_ROWS() AS total;');
      console.log('@@');
      const total = totalData[0].total;
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
      ctx.logger.error(`========小程序：获取订单列表错误 OrderServer.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
  /**
   * @description 小程序修改订单状态
   * @param info userId 用户ID orderId 订单ID
   */
  public async ModOrder(info: ModifyInfo) {
    const { ctx, app } = this;
    const { userId, orderId, state } = info;

    try {
      const list = await app.mysql.select('t_order', {
        where: {
          order_id: orderId,
          order_user_id: userId,
        },
        columns: [ 'order_state' ],
      });
      const orderState = list[0].order_state;
      if (orderState) {
        const result = await app.mysql.update('t_order', {
          order_state: state,
        }, {
          where: {
            order_id: orderId,
            order_user_id: userId,
          },
        });
        if (result.affectedRows === 1) {
          return { data: '修改订单状态成功' };
        }
        return { code: 5100 };
      }
      return { code: 5000 };
    } catch (err) {
      ctx.logger.error(`========小程序：调整订单状态错误 MppOrderServer.ModOrder.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
  /**
   * @description 小程序获取订单详情
   * @param ModInfo userId 用户ID orderId 订单ID
   */
  public async getOrderDetail(info: GetOrderDetail) {
    const { ctx, app } = this;
    const { userId, orderId } = info;
    const sql = `
        SELECT SQL_CALC_FOUND_ROWS
              o.order_id,
              o.order_state,
              o.order_total_price,
              o.order_real_price,
              o.order_create_time,
              o.order_rider_id,
              o.order_send_time,
              o.order_address,
              o.order_message,
              CONCAT('[', GROUP_CONCAT(CONCAT(${concatSql})), ']') AS order_product
        FROM t_order AS o LEFT OUTER JOIN order_product AS op
        ON o.order_id = op.op_order_id
        WHERE o.order_user_id = ?
        AND o.order_id = ?;
      `;
    try {
      let list = await app.mysql.query(sql, [ userId, orderId ]);
      list = jsonParse(list, 'order_product');
      const result = {
        list,
      };
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========小程序：获得订单详情 MppOrderServer.getOrderDetail.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
  /**
   * @description 小程序创建订单
   * @param order order_product 商品数组 order_send_time 商品送达时间 order_total_price 商品总价 order_address_id 订单地址 order_coupons_code 商品优惠券码
   * userId 用户名 openId openId
   */
  public async createOrder(order: Order): Promise<Code> {
    const { logger, app } = this;
    const {
      order_product,
      order_send_time,
      order_total_price,
      order_address_id,
      order_coupons_code,
      order_message,
      userId,
      openId,
    } = order;

    // 初始化事务
    const conn = await app.mysql.beginTransaction();

    try {
      const order_code = uuidV1(`${Date.parse(new Date().toString())}${userId}`).split('-');
      // 最终价格
      let finalPrice = order_total_price;
      let order_coupons_id: number;
      // 若优惠券为空，则优惠券码为0
      if (order_coupons_code !== 0 && order_coupons_code !== '' && order_coupons_code !== undefined) {
        // 根据优惠码找用户优惠券信息
        const coupons = await conn.mysql.select('coupons_user', {
          where: { cu_code: order_coupons_code },
        });
        // 根据优惠券种类找优惠券减免信息
        order_coupons_id = Number(coupons.map((item: { cu_coupons_id: number; }) => item.cu_coupons_id));
        const post = await conn.select('coupons', {
          where: { coupons_id: order_coupons_id },
        });
        const type = Number(post.map((item: { coupons_type: number; }) => item.coupons_type)); // 0折扣，1满减
        // console.log('@@@@@', type);
        const discount = Number(post.map((item: { coupons_discount: number; }) => item.coupons_discount)); // 没有小数点
        // console.log('@@@@@', discount);
        const priceMax = Number(post.map((item: { coupons_fill: number; }) => item.coupons_fill)); // 满多少
        // console.log('@@@@@', priceMax);
        const priceMin = Number(post.map((item: { coupons_minus: number; }) => item.coupons_minus)); // 减多少
        // console.log('@@@@@', priceMin);
        if (finalPrice >= priceMax) {
          if (type === 0) {
            // 使用折扣券
            finalPrice = order_total_price * 0.1 * discount;
          } else if (type === 1) {
            finalPrice -= priceMin;
          }
        }
      } else {
        order_coupons_id = 0;
      }
      // 获取商品信息,并把商品信息存入对象
      for (const item of order_product) {
        const productInfo = await conn.select('product', {
          where: { product_id: item.product_id },
          columns: [ 'product_price', 'product_unit', 'product_name', 'product_img' ],
        });
        Object.assign(item, productInfo[0]);
      }
      // 获取地址信息
      const addressInfo = await conn.get('address', { address_id: order_address_id }); // 查询地址信息
      const buildingId = addressInfo.address_building_id; // 获取楼栋ID
      const building = await conn.get('building', { building_id: buildingId }); // 查询楼栋
      const buildingName = building.building_name; // 获取楼栋名
      const roomId = addressInfo.address_room; // 获取寝室名
      const address = buildingName + ' ' + roomId; // 拼接地址，如"6号(知行苑1舍) 410"
      // 创建订单信息
      const orderInfo = {
        order_code: `${order_code[0]}${order_code[1]}`,
        order_total_price,
        order_real_price: finalPrice,
        order_user_id: userId,
        order_coupons_id,
        order_create_time: app.mysql.literals.now,
        order_update_time: app.mysql.literals.now,
        order_state: 0,
        order_send_time,
        order_rider_id: 0,
        order_address: address,
        order_message: order_message ? order_message : '',
      };
      console.log('@@@@@@', orderInfo);
      // 插入数据库
      // 订单表创建新的记录
      const creatResult = await conn.insert('t_order', orderInfo);
      const insertId = creatResult.insertId;
      // order_product表增加相应记录
      // 记录成功数据
      const insertResultArr: object[] = [];
      for (const item of order_product) {
        const opInfo = {
          op_order_id: insertId,
          op_product_id: item.product_id,
          op_name: item.product_name,
          op_number: item.product_num,
          op_price: item.product_price,
          op_unit: item.product_unit,
          op_picture: item.product_img,
        };
        const insertResult = await conn.insert('order_product', opInfo);
        insertResultArr.push(insertResult);
      }
      // 提交事务
      await conn.commit();
      // 统一下单接口
      const pay = await this.service.custom.pay.create({ ...orderInfo, finalPrice, openId, insertId: creatResult.insertId });
      const result = {
        ...pay,
        openId,
        insertResultArr,
        creatResult,
        order_code,
      };
      return { data: result };
    } catch (err) {
      logger.error(`========小程序：创建订单 MppOrderServer.createOrder.\n Error: ${err}`);
      await conn.rollback();
      return { code: 5200 };
    }
  }
}
