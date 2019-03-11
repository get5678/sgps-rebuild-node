// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/BaseController';
import ExportHome from '../../../app/controller/home';
import ExportManageAdmin from '../../../app/controller/manage/admin';
import ExportManageUser from '../../../app/controller/manage/user';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    home: ExportHome;
    manage: {
      admin: ExportManageAdmin;
      user: ExportManageUser;
    }
  }
}
