'use strict';

/**
 * @description admin server
 */

import { Service } from 'egg';
import encryption from '../../utils/encryption';
import { Admin, UpdateUser, UpdateInfo, User, ExamineInfo, List, Code } from '../../interface/admin';

export default class AdminServer extends Service {
  /**
   * @description 管理端用户注册
   * @param admin Admin 类型
   */
  public async registe(admin: Admin): Promise<Code> {
    const { app, ctx: { logger } } = this;
    const { ctx } = this;
    const result: Code = {
      code: -1,
    };
    const captchaInfo = 'registe' + admin.phone;
    try {
      if (!ctx.session.hasOwnProperty(captchaInfo)) return { code: 4001 };
      else if (admin.code.toLowerCase() !== ctx.session[captchaInfo]) return { code: 2009 };
      if (ctx.session.hasOwnProperty(admin.phone)) {
        return { code : 2008 };
      }
      admin.password = encryption(admin.phone, admin.password);
      const adminInfo = {
        admin_identity: admin.identity,
        admin_phone: admin.phone,
        admin_name: admin.name,
        admin_password: admin.password,
        admin_create_time: app.mysql.literals.now,
      };
      let admins: any = [];
      admins = await app.mysql.select('admin', { where: { admin_phone: admin.phone } });
      if (admins.length !== 0) {
        return { code: 2001 };
      }
      admins = await app.mysql.select('admin', { where: { admin_name: admin.name } });
      if (admins.length !== 0) {
        return { code: 2002 };
      }

      const data = await app.mysql.insert('admin', adminInfo);
      if (data.affectedRows === 0) {
        return result;
      }
      adminInfo.admin_password = '******';
      return {
        data: adminInfo,
      };
    } catch (err) {
      logger.error(`========管理端：管理人员注册错误 AdminServer.register phone=${admin.phone}, error: ${err}`);
      return result;
    }
  }
  /**
   * @description 管理端账号更新
   * @param admin UpdateUser类型
   */
  public async upadte(admin: UpdateUser): Promise<Code> {
    const { app } = this;
    const { ctx } = this;
    const loginPassWord = encryption(admin.phone, admin.password);
    const sql = `
    SELECT * FROM admin
    WHERE admin_phone = ${admin.phone}
    AND admin_password = '${loginPassWord}';
    `;

    try {
      // 检测用户名密码是否正确
      const adminError = await app.mysql.query(sql);
      const msg = adminError[0];
      if (!msg) {
        return { code: 2004 };
      }
      const userError = await app.mysql.get('admin', { admin_phone: admin.newPhone });
      if (userError) {
        return { code: 2001 };
      }
      // 如果用户要更新密码
      if (admin.newPassword) {
        // 新用户名存在 将密码根据新用户名加密
        if (admin.newPhone) {
          admin.newPassword = encryption(admin.newPhone, admin.newPassword);
        } else { // 新用户名不存在， 将密码根据旧用户名加密
          admin.newPassword = encryption(admin.phone, admin.newPassword);
        }
      }
      const info: UpdateInfo = {
        admin_password: admin.newPassword || loginPassWord,
        admin_phone: admin.newPhone || admin.phone,
      };
      if (admin.name) {
        const nameErr = await app.mysql.get('admin', { admin_name: admin.name });
        if (nameErr) {
          return { code: 2002 };
        }
        info.admin_name = admin.name;
      }
      const re = await app.mysql.update('admin', info, { where: { admin_id: msg.admin_id } });
      if (re.affectedRows === 1) {
        const result = await app.mysql.get('admin', { admin_phone: admin.newPhone || admin.phone });
        result.admin_password = '******';
        ctx.session[admin.newPhone || admin.phone] = admin.newPhone || admin.phone;
        return { data: result };
      } else {
        return { code: -1 };
      }
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员修改信息错误 AdminServer.modify phone=${admin}, error: ${err}`);
      return { code: -1 };
    }
  }
  /**
   * @description 管理端账号登录
   * @param admin user类型
   */
  public async login(admin: User): Promise<Code> {
    const { app } = this;
    const { ctx } = this;
    const captchaInfo: string = 'login' + admin.phone;
    if (!ctx.session.hasOwnProperty(captchaInfo)) return { code: 4001 };
    else if (admin.code.toLowerCase() !== ctx.session[captchaInfo]) return { code: 2009 };
    try {
      if (ctx.session.hasOwnProperty(admin.phone)) {
        return { code : 2008 };
      }
      const password: string = encryption(admin.phone, admin.password);
      const Err = await app.mysql.get('admin', { admin_phone: admin.phone });
      if (!Err) {
        return { code: 2003 };
      }
      if (Err.admin_password !== password) {
        return { code: 2004 };
      }
      Err.admin_password = '******';
      ctx.session[admin.phone] = admin.phone;
      console.log(ctx.session[captchaInfo]);
      return { data: Err };
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员登录错误 AdminServer.login.\n Error: ${err}`);
      return { code: -1 };
    }
  }
  /**
   * @description 登出
   * @param admin User类型
   */
  public async logout(admin: User): Promise<Code> {
    const { ctx } = this;

    if (!ctx.session[admin.phone]) {
      return { code: 2000 };
    }

    try {
      delete ctx.session[admin.phone];
      return { data: '退出成功' };
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员登录错误 AdminServer.logout.\n Error: ${err}`);
      return { code: -1 };
    }
  }
  /**
   * @description 注册用户的审核
   * @param user ExamineInfo 类型
   */
  public async examine(user: ExamineInfo): Promise<Code> {
    const { ctx } = this;
    const { app } = this;

    try {
      const info = await app.mysql.get('admin', { admin_id: user.id });
      if (!info) {
        return { code: 2003 };
      }
      const result = await app.mysql.update('admin', {
        admin_state: user.state,
      }, {
        where: {
          admin_id: user.id,
        },
      });
      if (result.affectedRows === 1) {
        return { data: '修改成功' };
      } else {
        return { code: -1 };
      }
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员状态管理错误 AdminServer.logout.\n Error: ${err}`);
      return { code: -1 };
    }
  }
  /**
   * @description 返回注册用户列表
   * @param listInfo List类型
   */
  public async showAdmins(listInfo: List): Promise<Code> {
    const { ctx } = this;
    const { app } = this;
    const sql = `
    SELECT SQL_CALC_FOUND_ROWS * FROM admin
    WHERE admin_state = 0
    LIMIT ${Number(listInfo.pageSize)}
    OFFSET ${Number(listInfo.pageSize) * (Number(listInfo.current) - 1)};
    `;

    try {
      const list = await app.mysql.query(sql);
      for (const item of list) {
        item.admin_password = '******';
      }
      const total = await app.mysql.query('select found_rows()');
      const realTotal = total[0]['found_rows()'];
      if (Number(listInfo.pageSize) * (Number(listInfo.current) - 1) > realTotal) {
        return { code: 7001 };
      }
      if (!list.length) {
        return { code: 7000 };
      }
      const result = {
        data: {
          pageSize: listInfo.pageSize,
          current: listInfo.current,
          total: realTotal,
          list,
        },
      };
      return result;
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员待审核名单获取错误 AdminServer.logout.\n Error: ${err}`);
      return { code: -1 };
    }
  }
}
