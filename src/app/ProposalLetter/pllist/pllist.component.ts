import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { LoginService } from 'src/app/login/login.service';
import { ProposalLetterService } from '../proposal-letter.service';

@Component({
  selector: 'app-pllist',
  templateUrl: './pllist.component.html',
  styleUrls: ['./pllist.component.css']
})
export class PLListComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private Login: LoginService,
    private PLService: ProposalLetterService,
    private toastService: HotToastService
  ) { }

  //Current user
  currentuserId = this.Login.getId();
  //Current role
  userrole=this.Login.getRoleId();

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

  //variable for expost pdf
  IsApproved: boolean = false;
  //Variable for Request PL for current assessment year 
  requestPL: boolean = true;

  ngOnInit(): void {
    this.getProposals(this.currentuserId);
  }

  getProposals(userId: number) {
    this.PLService.getAllPLByUserId(userId).subscribe((res) => {
      this.proposalList = res;
      console.log(res);
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
      })
    },
      (error) => {
        console.error("Error fetching proposals", error);
      }
    );
  }

  //New Pl request function
  OnclickRequest() {
    this.http.post(`http://localhost:5002/api/PL`, this.newproposal).subscribe({
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

}
