// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportManageAdmin from '../../../app/service/manage/admin';
import ExportManageProduct from '../../../app/service/manage/product';
import ExportManageRider from '../../../app/service/manage/rider';
import ExportManageUser from '../../../app/service/manage/user';
import ExportManageVerify from '../../../app/service/manage/verify';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    manage: {
      admin: ExportManageAdmin;
      product: ExportManageProduct;
      rider: ExportManageRider;
      user: ExportManageUser;
      verify: ExportManageVerify;
    }
  }
}
