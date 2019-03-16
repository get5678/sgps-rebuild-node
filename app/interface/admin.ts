'use strict';
/**
 * @description admin interface
 */

export interface Admin {
  name: string;
  password: string;
  identity: number;
  phone: string;
  code: string;
}

export interface Code {
  code?: number;
  data?: any;
}

export interface User {
  phone: string;
  password?: string;
  code: string;
}
export interface UpdateInfo {
  admin_name?: string;
  admin_phone: string;
  admin_password: string;
}

export interface UpdateUser {
  name?: string;
  phone: string;
  password: string;
  newPhone?: string;
  newPassword?: string;
}

export interface ExamineInfo {
  id: number;
  state: number;
}

export interface List {
  pageSize: string;
  current: string;
}
