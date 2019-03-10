'use strict';

/**
 * @description admin server
 */

import { Service } from 'egg';
import encryption from '../../utils/encryption';

export default class AdminServer extends Service {
  public async registe(admin: Admin): Promise<Code> {
    const { app, ctx: { logger } } = this;
    const result: Code = {
      code: -1,
    };

    try {
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
      return {
        data: adminInfo,
      };
    } catch (err) {
      logger.error(`========管理端：管理人员注册错误 AdminServer.register phone=${admin.phone}, error: ${err}`);
      return result;
    }
  }

  public async upadte(admin: UpdateUser): Promise<Code> {
    const { app } = this;
    const { ctx } = this;

    try {
      const loginPassWord = encryption(admin.phone, admin.password);
      // 检测用户名密码是否正确
      const adminError = await app.mysql.select('admin', { admin_password: loginPassWord });
      if (!adminError.affectedRows) {
        return { code: 2004 };
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
        admin_password: admin.newPassword || admin.password,
        admin_phone: admin.newPhone || admin.phone,
      }
      if (admin.name) info.admin_name = admin.name;
      await app.mysql.update('admin', info, { where: { admin_phone: admin.phone } });
      const result = await app.mysql.select('admin', { admin_phone: admin.newPhone || admin.phone });
      return { data: { ...result } };
    } catch (err) {
      ctx.logger.error(`========管理端：管理人员修改信息错误 AdminServer.modify phone=${admin}, error: ${err}`);
      return { code: -1 };
    }
  }
}

export interface Admin {
  name: string;
  password: string;
  identity: number;
  phone: string;
}

export interface Code {
  code?: number;
  data?: any;
}

export interface UpdateInfo {
  admin_name?: string;
  admin_phone: string;
  admin_password: string;
}

export interface UpdateUser {
  name?: string;
  phone: string;
  password: string;
  newPhone?: string;
  newPassword?: string;
}