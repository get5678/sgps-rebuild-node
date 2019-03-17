// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportCustomBanner from '../../../app/service/custom/banner';
import ExportManageAdmin from '../../../app/service/manage/admin';
import ExportManageBuilding from '../../../app/service/manage/building';
import ExportManageCategory from '../../../app/service/manage/category';
import ExportManageCoupons from '../../../app/service/manage/coupons';
import ExportManageProduct from '../../../app/service/manage/product';
import ExportManageRider from '../../../app/service/manage/rider';
import ExportManageUser from '../../../app/service/manage/user';
import ExportManageVerify from '../../../app/service/manage/verify';
import ExportUserLogin from '../../../app/service/user/login';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    custom: {
      banner: ExportCustomBanner;
    }
    manage: {
      admin: ExportManageAdmin;
      building: ExportManageBuilding;
      category: ExportManageCategory;
      coupons: ExportManageCoupons;
      product: ExportManageProduct;
      rider: ExportManageRider;
      user: ExportManageUser;
      verify: ExportManageVerify;
    }
    user: {
      login: ExportUserLogin;
    }
  }
}
