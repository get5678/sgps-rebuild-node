'use strict';

/**
 * @description admin server
 */

import { Service } from 'egg';

export default class AdminServer extends Service {
  public async registe(admin: Admin): Promise<Code> {
    const { app, ctx: { logger }} = this;
    const result: Code = {
      code: -1,
    };

    try {
      const adminInfo = {
        admin_identity: admin.identity,
        admin_phone: admin.phone,
        admin_name: admin.name,
        admin_password: admin.password,
        admin_create_time: app.mysql.literals.now,
      };
      let admins: any = [];
      admins = await app.mysql.select('admin', { where: { admin_phone: admin.phone } });
      if (admins.length !== 0 ) {
        return { code: -2 };
      }
      admins = await app.mysql.select('admin', { where: { admin_name: admin.name } });
      if (admins.length !== 0) {
        return { code: -3 };
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
