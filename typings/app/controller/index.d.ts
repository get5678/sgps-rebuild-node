// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/BaseController';
import ExportHome from '../../../app/controller/home';
import ExportCustomBanner from '../../../app/controller/custom/banner';
import ExportManageAdmin from '../../../app/controller/manage/admin';
import ExportUserLogin from '../../../app/controller/user/login';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    home: ExportHome;
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
