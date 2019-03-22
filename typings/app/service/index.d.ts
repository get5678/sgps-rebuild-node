// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportCustomAddress from '../../../app/service/custom/address';
import ExportCustomBanner from '../../../app/service/custom/banner';
import ExportCustomGetIndexList from '../../../app/service/custom/getIndexList';
import ExportCustomOrder from '../../../app/service/custom/order';
import ExportCustomProduct from '../../../app/service/custom/product';
import ExportManageAdmin from '../../../app/service/manage/admin';
import ExportManageBuilding from '../../../app/service/manage/building';
import ExportManageCategory from '../../../app/service/manage/category';
import ExportManageCoupons from '../../../app/service/manage/coupons';
import ExportManageOrder from '../../../app/service/manage/order';
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
      getIndexList: ExportCustomGetIndexList;
      order: ExportCustomOrder;
      product: ExportCustomProduct;
    }
    manage: {
      admin: ExportManageAdmin;
      building: ExportManageBuilding;
      category: ExportManageCategory;
      coupons: ExportManageCoupons;
      order: ExportManageOrder;
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
