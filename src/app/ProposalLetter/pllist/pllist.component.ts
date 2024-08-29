import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { LoginService } from 'src/app/login/login.service';
import { ProposalLetterService } from '../proposal-letter.service';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { PLStatus } from 'src/app/Models/PLStatus';
import { UserService } from 'src/app/User/user.service';

@Component({
  selector: 'app-pllist',
  templateUrl: './pllist.component.html',
  styleUrls: ['./pllist.component.css']
})
export class PLListComponent implements OnInit {

  constructor(
    private http: HttpClient,
    public Login: LoginService,
    private PLService: ProposalLetterService,
    private toastService: HotToastService,
    private router: Router,
    private userService: UserService
  ) { }

  //Enum PLstatus
  plStatus = PLStatus;
  //Current user
  currentuserId = this.Login.getId();
  //Current role
  userrole = this.Login.getRoleId();
  userName = this.Login.getFullname();

  //New PLRequest 
  newproposal: any = {
    userId: this.currentuserId,
    assessmentYear: "2024-2025",
    plstatusId: 1,
    createdBy: this.currentuserId
  }

  //Get ProposalList for the current userId
  proposalList: any = [];
  getdata: any;
  //variable for expost pdf
  IsApproved: boolean = false;
  //Variable for Request PL for current assessment year 
  isRequestPL: boolean = true;

  ngOnInit(): void {
    this.getProposals(this.currentuserId);
    console.log(this.userrole, "This is user role");
    console.log(this.Login.IsUser, "User role");
  }

  getProposals(userId: number) {
    if (this.Login.IsUser) {
      this.getdata = this.PLService.getAllPLByUserId(userId);
    }
    else if (this.Login.IsAdmin) {
      this.getdata = this.PLService.getAllPL();
    }
    else if (this.Login.IsPreparer) {
      this.getdata = this.PLService.getAllPLByPreparerId(userId);
    }
    else if (this.Login.IsReviewer) {
      this.getdata = this.PLService.getAllPLByReviewerId(userId);
    }
    else {
      this.getdata = this.PLService.getAllPLByApproverId(userId);
    }
    this.getdata.subscribe((res: any) => {
      this.proposalList = res;
      console.log(this.proposalList, "This is PL");
      this.proposalList.forEach((proposal: any) => {
        if (proposal.assessmentYear == "2024-2025") {
          this.isRequestPL = false;
        }
        this.userService.getUserById(proposal.userId).subscribe((res: any) => {
          proposal.UserName = res.name;
        })

      });
    },
      (error: any) => {
        console.error("Error fetching proposals", error);
      }
    );
  }

  //New Pl request function
  OnclickRequest() {
    this.PLService.postPL(this.newproposal).subscribe({
      next: (res: any) => {
        this.toastService.success('Proposal Letter request sent successfully');

        setTimeout(() => {
          window.location.replace('/PLList');
        }, 100);
      },
      error: (err: any) => {
        if (err['error'] == 'error') {
          this.toastService.error(err['error']);
        }
      }
    });
  }
  ExportPDF(PLId: number) {
    console.log("Expost method");
    var mediaType = 'application/pdf';
    this.PLService.ExportPDF(PLId).subscribe({
      next: (res: any) => {
        var blob = new Blob([res], { type: mediaType });
        const fileName = `ProposalLetter_${PLId}.pdf`;
        console.log(res, "The fle");
        saveAs(blob, fileName);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }
}
