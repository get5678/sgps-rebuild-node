// This file is created by egg-ts-helper
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportTest from '../../../app/service/Test';
import ExportManageAdmin from '../../../app/service/manage/admin';

declare module 'egg' {
  interface IService {
    test: ExportTest;
    manage: {
      admin: ExportManageAdmin;
    }
  }
}
