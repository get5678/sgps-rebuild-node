// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/BaseController';
import ExportHome from '../../../app/controller/home';
import ExportManageAdmin from '../../../app/controller/manage/admin';
import ExportManageCategory from '../../../app/controller/manage/category';
import ExportManageRider from '../../../app/controller/manage/rider';
import ExportManageUser from '../../../app/controller/manage/user';
import ExportManageVerify from '../../../app/controller/manage/Verify';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    home: ExportHome;
    manage: {
      admin: ExportManageAdmin;
      category: ExportManageCategory;
      rider: ExportManageRider;
      user: ExportManageUser;
      verify: ExportManageVerify;
    }
  }
}
