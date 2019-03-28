// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportBaseController from '../../../app/controller/BaseController';
import ExportHome from '../../../app/controller/home';
import ExportUpload from '../../../app/controller/upload';
import ExportCustomAddress from '../../../app/controller/custom/address';
import ExportCustomBanner from '../../../app/controller/custom/banner';
import ExportCustomComment from '../../../app/controller/custom/comment';
import ExportCustomCoupons from '../../../app/controller/custom/coupons';
import ExportCustomGetIndexList from '../../../app/controller/custom/getIndexList';
import ExportCustomOrder from '../../../app/controller/custom/order';
import ExportCustomProduct from '../../../app/controller/custom/product';
import ExportManageVerify from '../../../app/controller/manage/Verify';
import ExportManageAdmin from '../../../app/controller/manage/admin';
import ExportManageBuilding from '../../../app/controller/manage/building';
import ExportManageCategory from '../../../app/controller/manage/category';
import ExportManageCoupons from '../../../app/controller/manage/coupons';
import ExportManageOrder from '../../../app/controller/manage/order';
import ExportManageProduct from '../../../app/controller/manage/product';
import ExportManageRider from '../../../app/controller/manage/rider';
import ExportManageUser from '../../../app/controller/manage/user';
import ExportRiderRider from '../../../app/controller/rider/rider';
import ExportUserLogin from '../../../app/controller/user/login';
import ExportUserPhone from '../../../app/controller/user/phone';

declare module 'egg' {
  interface IController {
    baseController: ExportBaseController;
    home: ExportHome;
    upload: ExportUpload;
    custom: {
      address: ExportCustomAddress;
      banner: ExportCustomBanner;
      comment: ExportCustomComment;
      coupons: ExportCustomCoupons;
      getIndexList: ExportCustomGetIndexList;
      order: ExportCustomOrder;
      product: ExportCustomProduct;
    }
    manage: {
      verify: ExportManageVerify;
      admin: ExportManageAdmin;
      building: ExportManageBuilding;
      category: ExportManageCategory;
      coupons: ExportManageCoupons;
      order: ExportManageOrder;
      product: ExportManageProduct;
      rider: ExportManageRider;
      user: ExportManageUser;
    }
    rider: {
      rider: ExportRiderRider;
    }
    user: {
      login: ExportUserLogin;
      phone: ExportUserPhone;
    }
  }
}
