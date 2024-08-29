import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalLetterService } from 'src/app/ProposalLetter/proposal-letter.service';
import { UserService } from '../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';
import { PLStatus } from 'src/app/Models/PLStatus';
import { Role } from 'src/app/Models/Role';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private plService: ProposalLetterService,
    private userService: UserService,
    private toastService: HotToastService,
    private router: Router
  ) { }
  //Current PLID
  plId = 0;
  //Get PL
  proposalLetter: any;
  // Enum PlStatus
  plstatus = PLStatus;
  // Enum role
  role = Role;
  //Update proposalLetter
  PL: any = {
    preparerId: 0,
    reviewerId: 0,
    approverId: 0
  }

  //Get user details
  userDetails: any = [];
  //Get all reviewer
  reviewerList: any = [];
  //Get all Preparer
  preparerList: any = [];
  //Get all Approver
  ApproverList: any = [];

  ngOnInit(): void {
    this.plId = this.route.snapshot.params['PLId'];

    console.log(this.plId);
    this.loadProposalLetter();
  }
  loadProposalLetter() {
    this.plService.getPLById(this.plId).subscribe(pl => {
      this.proposalLetter = pl;
      this.PL = pl;
      this.loadUserDetails();
      this.LoadApproverList();
      this.LoadPreparerList();
      this.LoadreviewerList();
    });
  }
  loadUserDetails() {
    // Fetch user details related to the proposal letter
    this.userService.getUserById(this.proposalLetter.userId).subscribe(details => {
      this.userDetails = details;
    });
  }
  LoadPreparerList() {
    this.userService.getAllUsersByRoleId(Role.Preparer).subscribe(preparer => {
      this.preparerList = preparer;
    });
  }
  LoadreviewerList() {
    this.userService.getAllUsersByRoleId(Role.Reviewer).subscribe(reviewer => {
      this.reviewerList = reviewer;
    });
  }
  LoadApproverList() {
    this.userService.getAllUsersByRoleId(Role.Approver).subscribe(approver => {
      this.ApproverList = approver;
    });
  }

  OnSubmit() {
    this.PL.plstatusId = this.plstatus.Preparing;
    this.plService.updatePL(this.plId, this.PL).subscribe({
      next: (res: any) => {
        this.toastService.success("Proposal Letter updated successfully");

        setTimeout(() => {
          this.router.navigate(['/PLrequest']);
        }, 500);
      },
      error: (err) => {
        this.toastService.error("Error on Assigning");
        console.error("Error on updating", err);
      }
    });
  }
}
