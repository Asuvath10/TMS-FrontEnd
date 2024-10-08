import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    public Login: LoginService

  ) { }
  ngOnInit() {

  }

  LogOut() {
    localStorage.clear();
    window.location.replace('Login');
  }
}
