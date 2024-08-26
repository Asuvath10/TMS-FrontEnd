import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { LoginService } from 'src/app/login/login.service';
import { ProposalLetterService } from '../proposal-letter.service';
import { Router } from '@angular/router';

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
    private router: Router
  ) { }

  //Current user
  currentuserId = this.Login.getId();
  //Current role
  userrole = this.Login.getRoleId();
  userName = this.Login.getFullname();


  //Proposal Model
  proposal: any = {
    id: "",
    approver: "",
    AssessmentYear: "",
    plstatusId: ""
  }

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
  requestPL: boolean = true;

  ngOnInit(): void {
    this.getProposals(this.currentuserId);
    console.log(this.userrole, "This is user role");
  }

  getProposals(userId: number) {
    if (this.userrole == 2) {
      this.getdata = this.PLService.getAllPLByUserId(userId);
    }
    else if (this.userrole == 1) {
      this.getdata = this.PLService.getAllPL();
    }
    else if (this.userrole == 3) {
      this.getdata = this.PLService.getAllPLByPreparerId(userId);
    }
    else if (this.userrole == 4) {
      this.getdata = this.PLService.getAllPLByReviewerId(userId);
    }
    else {
      this.getdata = this.PLService.getAllPLByApproverId(userId);
    }
    this.getdata.subscribe((res: any) => {
      this.proposalList = res;
      this.proposalList.forEach((proposal: any) => {
        if (proposal.assessmentYear == "2024-2025") {
          this.requestPL = false;
        }
        this.PLService.getPLStatusbyId(proposal.plstatusId).subscribe((statusData: any) => {
          proposal.plstatusId = statusData.status;
        },
          (error) => {
            console.error('Error fetching status', error);
          }
        );
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
        }, 500);
      },
      error: (err: any) => {
        if (err['error'] == 'error') {
          this.toastService.error(err['error']);
        }
      }
    });
  }
  ExportPDF(PLId: number) {
    this.PLService.ExportPDF(PLId).subscribe((res: Blob) => {
      console.log(res, "The fle");
      const url = window.URL.createObjectURL(res);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = `Document.pdf`;
      anchor.click();
      window.URL.revokeObjectURL(url);
    });
  }
  LogOut() {
    localStorage.clear();
    this.router.navigate(['/Login']);
  }
}
