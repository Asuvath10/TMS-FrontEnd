import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProposalLetterService } from 'src/app/ProposalLetter/proposal-letter.service';
import { UserService } from '../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private plService: ProposalLetterService,
    private userService: UserService
  ) { }
  //Current PLID
  plId = 0;
  //Get PL
  proposalLetter: any = [];
  //Get user details
  userDetails: any = [];
  preparerId = 0;
  reviewerId = 0;
  ApproverId = 0;
  //Get all reviewer
  reviewerList: any = [];
  //Get all Preparer
  preparerList: any = [];
  //Get all Approver
  ApproverList: any = [];

  //UserAssigning for PL form
  PLform = new FormGroup({
    Preparer: new FormControl(['', Validators.required]),
    Reviewer: new FormControl(['']),
    Approver: new FormControl(['', Validators.required])
  });

  ngOnInit(): void {
    this.plId = this.route.snapshot.params['PLId'];
    console.log(this.plId);
    this.loadProposalLetter();
    this.LoadApproverList();
    this.LoadPreparerList();
    this.reviewerList();
  }
  loadProposalLetter() {
    this.plService.getPLById(this.plId).subscribe(pl => {
      this.proposalLetter = pl;
      console.log(pl, "This is pl");
      this.loadUserDetails();
    });
  }
  loadUserDetails() {
    // Fetch user details related to the proposal letter
    this.userService.getUserById(this.proposalLetter.userId).subscribe(details => {
      this.userDetails = details;
    });
  }
  LoadPreparerList() {
    this.userService.getAllUsersByRoleId(3).subscribe(preparer => {
      this.preparerList = preparer;
    });
  }
  LoadreviewerList() {
    this.userService.getAllUsersByRoleId(4).subscribe(reviewer => {
      this.reviewerList = reviewer;
    });
  }
  LoadApproverList() {
    this.userService.getAllUsersByRoleId(5).subscribe(approver => {
      this.ApproverList = approver;
    });
  }
  OnSubmit(){
    
  }
}
