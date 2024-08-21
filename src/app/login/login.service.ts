import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor() { if (this.IsloggedIn) this.CheckUsers(); }

  public IsloggedIn = localStorage.getItem('Token') != null;
  public DecodedToken: any = jwtDecode(this.getToken());
  public IsAdmin = false;
  public IsUser = false;
  public IsPreparer = false;
  public IsReviewer = false;
  public IsApprover = false;

  CheckUsers() {
    this.IsAdmin = (this.getRole() == 'Admin');

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
      return this.DecodedToken.Role;
    } else {
      return '';
    }
  }
  getRoleId() {
    if (this.getToken() != undefined) {
      return this.DecodedToken.RoleId;
    } else {
      return '';
    }
  }
  getId() {
    if (this.getToken() != undefined) {
      return this.DecodedToken.UserId;
    } else {
      return '';
    }
  }
  getFullname() {
    if (this.getToken() != undefined) {
      console.log(this.DecodedToken.FullName);
      return this.DecodedToken.FullName;
    } else {
      return '';
    }
  }
}
