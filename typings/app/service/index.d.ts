// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportCustomBanner from '../../../app/service/custom/banner';
import ExportManageAdmin from '../../../app/service/manage/admin';
import ExportUserLogin from '../../../app/service/user/login';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    custom: {
      banner: ExportCustomBanner;
    }
    manage: {
      admin: ExportManageAdmin;
    }
    user: {
      login: ExportUserLogin;
    }
  }
}
