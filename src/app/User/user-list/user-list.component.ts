import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }
  //UserList
  UserList: any = [];


  ngOnInit(): void {
    this.getAllUsers();
  }
  getAllUsers() {
    this.userService.getAllUsers().subscribe(res => {
      this.UserList = res;
      this.UserList.forEach((user: any) => {
        this.userService.getRoleById(user.roleId).subscribe((roleData: any) => {
          user.roleId = roleData.roleName;
        })
      })
    },
      (error) => {
        console.error("Error fetching Users", error);
      }
    );
  }
}
