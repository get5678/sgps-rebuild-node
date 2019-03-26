'use strict';
/**
 * @description order server
 */

export interface Code {
  code?: number;
  data?: any;
}

export interface Info {
  pageSize?: number;
  current?: number;
  product_id?: number;
}

export interface ComInfo {
  orderId?: number;
  productId?: number;
  message?: string;
  star?: number;
}

import { Service } from 'egg';

export default class MppCommentServer extends Service {
  /**
   * @description 获取该商品的所有评论
   * @param Info pageSize 一页大小 current 当前页数 product_id 商品id
   */
  public async getList(param: Info): Promise<Code> {
    const { ctx, app } = this;
    const { pageSize, current, product_id } = param;
    const sql = `
    SELECT
      c.comment_message,
      c.comment_star,
      c.comment_create_time,
      c.comment_name
    FROM
      comment_order co
      LEFT OUTER JOIN product p ON p.product_id = co.cop_product_id
      LEFT OUTER JOIN c_comment c ON c.comment_id = co.cop_comment_id
    WHERE
      p.product_id = ?
    LIMIT ${Number(pageSize)} OFFSET ${Number(pageSize) * (Number(current) - 1)};
    `;

    try {
      const list = await app.mysql.query(sql, [ product_id ]);
      const totalData = await app.mysql.query('SELECT FOUND_ROWS() AS total;');
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
      ctx.logger.error(`========小程序：获取商品评论列表错误 MppCommentServer.getList.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
  /**
   * @description 获取该订单的评论
   * @param orderId
   */
  public async order(orderId: number): Promise<Code> {
    const { ctx, app } = this;
    const sql = `
    SELECT
      op.op_name,
      op.op_number,
      op.op_price,
      op.op_unit,
      op.op_picture,
      c.comment_message,
      c.comment_star
    FROM
      comment_order co
      LEFT OUTER JOIN c_comment c ON c.comment_id = co.cop_comment_id
      LEFT OUTER JOIN t_order o ON o.order_id = co.cop_order_id
      LEFT OUTER JOIN order_product op ON o.order_id = op.op_order_id AND co.cop_product_id = op.op_product_id
    WHERE
      o.order_id = 1;
    `;

    try {
      const result = await app.mysql.query(sql, [ orderId ]);
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========小程序：获取订单评论列表错误 MppCommentServer.order.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
  /**
   * @description 上传订单的评论
   * @param comInfo orderId 订单Id productId 商品Id
   */
  public async post(comInfo: ComInfo): Promise<Code> {
    const { ctx, app } = this;
    const { orderId, productId, message, star } = comInfo;

    try {
      const result = await app.mysql.beginTransactionScope(async conn => {
        const orderData = await conn.select('t_order', {
          where: { order_id: orderId },
          columns: [ 'order_user_id' ],
        });
        const userId = orderData[0].order_user_id;
        const userNameData = await conn.select('user', {
          where: { user_id: userId },
          columns: [ 'user_name' ],
        });
        const userName = userNameData[0].user_name;
        const data2 = await conn.insert('c_comment', {
          comment_message: message,
          comment_star: star,
          comment_create_time: this.app.mysql.literals.now,
          comment_name: userName,
        });
        const co_id = data2.insertId;
        await conn.insert('comment_order', {
          cop_product_id: productId,
          cop_order_id: orderId,
          cop_comment_id: co_id,
        });
        return { success: '增加评论成功' };
      }, this.ctx);
      return { data: result };
    } catch (err) {
      ctx.logger.error(`========小程序：上传订单的评论 MppCommentServer.post.\n Error: ${err}`);
      return { code: 1000 };
    }
  }
}
