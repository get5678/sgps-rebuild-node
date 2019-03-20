// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportCustomAddress from '../../../app/service/custom/address';
import ExportCustomBanner from '../../../app/service/custom/banner';
import ExportManageAdmin from '../../../app/service/manage/admin';
import ExportManageCategory from '../../../app/service/manage/category';
import ExportManageProduct from '../../../app/service/manage/product';
import ExportManageRider from '../../../app/service/manage/rider';
import ExportManageUser from '../../../app/service/manage/user';
import ExportManageVerify from '../../../app/service/manage/verify';
import ExportUserLogin from '../../../app/service/user/login';
import ExportUserPhone from '../../../app/service/user/phone';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    custom: {
      address: ExportCustomAddress;
      banner: ExportCustomBanner;
    }
    manage: {
      admin: ExportManageAdmin;
      category: ExportManageCategory;
      product: ExportManageProduct;
      rider: ExportManageRider;
      user: ExportManageUser;
      verify: ExportManageVerify;
    }
    user: {
      login: ExportUserLogin;
      phone: ExportUserPhone;
    }
  }
}
