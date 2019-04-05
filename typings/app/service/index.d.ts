// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCustomAddress from '../../../app/service/custom/address';
import ExportCustomBanner from '../../../app/service/custom/banner';
import ExportCustomComment from '../../../app/service/custom/comment';
import ExportCustomCoupons from '../../../app/service/custom/coupons';
import ExportCustomGetIndexList from '../../../app/service/custom/getIndexList';
import ExportCustomOrder from '../../../app/service/custom/order';
import ExportCustomPay from '../../../app/service/custom/pay';
import ExportCustomPayCallBack from '../../../app/service/custom/payCallBack';
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
import ExportRiderRider from '../../../app/service/rider/rider';
import ExportUserLogin from '../../../app/service/user/login';
import ExportUserPhone from '../../../app/service/user/phone';

declare module 'egg' {
  interface IService {
    custom: {
      address: ExportCustomAddress;
      banner: ExportCustomBanner;
      comment: ExportCustomComment;
      coupons: ExportCustomCoupons;
      getIndexList: ExportCustomGetIndexList;
      order: ExportCustomOrder;
      pay: ExportCustomPay;
      payCallBack: ExportCustomPayCallBack;
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
    rider: {
      rider: ExportRiderRider;
    }
    user: {
      login: ExportUserLogin;
      phone: ExportUserPhone;
    }
  }
}
