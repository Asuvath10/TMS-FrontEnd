import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalLetterService } from 'src/app/ProposalLetter/proposal-letter.service';
import { UserService } from '../user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HotToastService } from '@ngneat/hot-toast';

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

  //Update proposalLetter
  PL: any = {
    // id: 0,
    // userId: '',
    preparerId: 0,
    reviewerId: 0,
    approverId: 0,
    // assessmentYear: '',
    // //Setting up status to preparing
    // plstatusId: 0,
    // createdOn: '',
    // createdBy: ''
  }

  //Get user details
  userDetails: any = [];
  // preparerId = 0;
  // reviewerId = 0;
  // ApproverId = 0;
  //Get all reviewer
  reviewerList: any = [];
  //Get all Preparer
  preparerList: any = [];
  //Get all Approver
  ApproverList: any = [];

  // //UserAssigning for PL form
  // PLform = new FormGroup({
  //   preparerId: new FormControl(['', Validators.required]),
  //   reviewerId: new FormControl(['']),
  //   approverId: new FormControl(['', Validators.required])
  // });

  ngOnInit(): void {
    this.plId = this.route.snapshot.params['PLId'];

    console.log(this.plId);
    this.loadProposalLetter();
  }
  loadProposalLetter() {
    this.plService.getPLById(this.plId).subscribe(pl => {
      this.proposalLetter = pl;
      this.PL = pl;
      console.log(pl, "This is pl");
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
  
  OnSubmit() {
    console.log("hi");
    console.log(this.plId, "PL Id");
    console.log(this.PL, "PL content");
    this.PL.plStatus.id = 2;
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
