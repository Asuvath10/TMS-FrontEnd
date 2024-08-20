import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor() { if (this.IsloggedIn) this.CheckUsers(); }

  public IsloggedIn = localStorage.getItem('Token') != null;
  public IsAdmin = false;
  public IsUser = false;
  public IsPreparer = false;
  public IsReviewer = false;
  public IsApprover = false;

  CheckUsers() {

    this.IsAdmin = (this.getRole() == 'Admin')

    this.IsUser = (this.getRole() == 'User')

    this.IsPreparer = (this.getRole() == 'Preparer')

    this.IsReviewer = (this.getRole() == 'Reviewer')

    this.IsApprover = (this.getRole() == 'Approver')
  }

  getToken() {
    return localStorage.getItem('Token') || '';
  }

  getRole() {
    if (this.getToken() != undefined) {
      var _token = this.getToken();
      var extract = _token.split('.')[1];
      var _atobtoken = atob(extract);
      var _finaldata = JSON.parse(_atobtoken);
      return _finaldata.Role;
    } else {
      return '';
    }
  }
  getRoleId() {
    if (this.getToken() != undefined) {
      var _token = this.getToken();
      var extract = _token.split('.')[1];
      var _atobtoken = atob(extract);
      var _finaldata = JSON.parse(_atobtoken);
      return _finaldata.RoleId;
    } else {
      return '';
    }
  }
  getId() {
    if (this.getToken() != undefined) {
      var _token = this.getToken();
      var extract = _token.split('.')[1];
      var _atobtoken = atob(extract);
      var _finaldata = JSON.parse(_atobtoken);
      return _finaldata.UserId;
    } else {
      return '';
    }
  }
  getFullname() {
    if (this.getToken() != undefined) {
      var _token = this.getToken();
      var extract = _token.split('.')[1];
      var _atobtoken = atob(extract);
      var _finaldata = JSON.parse(_atobtoken);
      return _finaldata.FullName;
    } else {
      return '';
    }
  }
}
