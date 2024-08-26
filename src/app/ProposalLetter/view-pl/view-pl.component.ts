import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProposalLetterService } from '../proposal-letter.service';
import { UserService } from 'src/app/User/user.service';
import { LoginService } from 'src/app/login/login.service';

@Component({
  selector: 'app-view-pl',
  templateUrl: './view-pl.component.html',
  styleUrls: ['./view-pl.component.css']
})
export class ViewPLComponent implements OnInit {
  forms: any[] = [];
  SelectedForm: any;
  canEdit = false;
  userId = 0;
  plId = 0;
  userDetails = {
    name: '',
    email: '',
    pan: '',
    address: '',
    fullName: '',
    role: ''
  }
  constructor(
    private route: ActivatedRoute,
    private plService: ProposalLetterService,
    private userService: UserService,
    private loginsService: LoginService
  ) { }

  ngOnInit(): void {
    this.plId = this.route.snapshot.params['PLId'];
    this.userId = this.loginsService.getId();
    console.log(this.loginsService.getId());
    this.loadUserDetails();
    this.loadFormDetails();
  }
  loadUserDetails(): void {
    // Fetch user details related to the proposal letter
    this.userService.getUserById(this.userId).subscribe((details: any) => {
      this.userDetails = details;
    });
  }
  loadFormDetails(): void {
    //Fetch forms for the current pl
    this.plService.getallFormsByPLId(this.plId).subscribe((f: any) => {
      this.forms = f;
      console.log(f, "This is forms");
    });
  }
}
