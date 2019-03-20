// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/BaseController';
import ExportHome from '../../../app/controller/home';
import ExportCustomAddress from '../../../app/controller/custom/address';
import ExportCustomBanner from '../../../app/controller/custom/banner';
import ExportManageVerify from '../../../app/controller/manage/Verify';
import ExportManageAdmin from '../../../app/controller/manage/admin';
import ExportManageCategory from '../../../app/controller/manage/category';
import ExportManageRider from '../../../app/controller/manage/rider';
import ExportManageUser from '../../../app/controller/manage/user';
import ExportUserLogin from '../../../app/controller/user/login';
import ExportUserPhone from '../../../app/controller/user/phone';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    home: ExportHome;
    custom: {
      address: ExportCustomAddress;
      banner: ExportCustomBanner;
    }
    manage: {
      verify: ExportManageVerify;
      admin: ExportManageAdmin;
      category: ExportManageCategory;
      rider: ExportManageRider;
      user: ExportManageUser;
    }
    user: {
      login: ExportUserLogin;
      phone: ExportUserPhone;
    }
  }
}
