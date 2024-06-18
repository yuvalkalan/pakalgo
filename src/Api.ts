import { UserProfile, hashString } from "./App";
import { Pakal, PakalError } from "./components/DataDisplay/Interfaces";
import { loginResponse } from "./components/HomeBody/HomeBody";
import {
  permissionEntry,
  permissionsInfoData,
} from "./components/AdminPanelBody/PermissionTab/PermissionTab";
import {
  userEntry,
  usersInfoData,
} from "./components/AdminPanelBody/UserTab/UserTab";

interface responseObj {
  isError: boolean;
  message: string;
  statusCode: number;
  data: any;
}

export const CUSTOM_CODES = { NoChange: 460, InvalidPakal: 461 };

export default class Api {
  username: string;
  hashedPassword: string;

  constructor({ username, password }: UserProfile) {
    this.username = username;
    this.hashedPassword = hashString(password);
  }

  private request(
    toGet: string,
    action: (data: any) => void = () => {},
    sendData: any = {},
    ifError: (statusCode: number, data: any | null) => void = () => {}
  ) {
    fetch(`/api/${toGet}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: sendData,
        auth: { username: this.username, password: this.hashedPassword },
      }),
    })
      .then((res) => res.json())
      .then((response: responseObj) => {
        console.log(response);
        if (!response.isError) action(response.data);
        else ifError(response.statusCode, response.data);
      });
  }

  getPakal(newOnly: boolean, action: (data: Pakal) => void) {
    this.request("getPakal", action, { newOnly: newOnly });
  }

  setPakal(
    newPakal: Pakal,
    action: () => void,
    ifError: (statusCode: number, data: PakalError[] | null) => void
  ) {
    this.request("setPakal", action, newPakal, ifError);
  }

  getHistory(action: (data: any) => void) {
    this.request("getHistory", action);
  }

  getRecord(
    newOnly: boolean,
    datetime: string | undefined,
    action: (data: Pakal) => void,
    ifError: (statusCode: number, data: null) => void
  ) {
    this.request(
      `getRecord/${datetime}`,
      action,
      { newOnly: newOnly },
      ifError
    );
  }

  removeRecord(filename: string, action: () => void) {
    this.request("removeRecord", action, { filename: filename });
  }

  removeTimeRange(hours: number, action: () => void) {
    this.request("removeTimeRange", action, { timeRange: hours });
  }

  setLogin(
    username: string,
    password: string,
    action: (data: loginResponse) => void
  ) {
    this.username = username;
    this.hashedPassword = hashString(password);
    this.request("login", action);
  }

  setPassword(username: string, hashedPassword: string, action: () => void) {
    this.request("setPassword", action, {
      username: username,
      password: hashedPassword,
    });
  }

  getPermissions(action: (data: permissionsInfoData) => void): void {
    this.request("getPermissionsData", action);
  }

  setPermissions(permissions: permissionEntry[]) {
    this.request("setPermissionsData", undefined, permissions);
  }

  getUsers(action: (data: usersInfoData) => void) {
    this.request("getUsersData", action);
  }

  setUsers(usersInfo: userEntry[]) {
    this.request("setUsersData", undefined, usersInfo);
  }

  setResetPassword(userId: number) {
    this.request("resetPassword", undefined, { userId: userId });
  }
}
