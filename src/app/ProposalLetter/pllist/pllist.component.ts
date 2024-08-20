import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-pllist',
  templateUrl: './pllist.component.html',
  styleUrls: ['./pllist.component.css']
})
export class PLListComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private toastService: HotToastService
  ) { }

  //Current user
  currentuserId = 1;

  //Proposal Model
  proposal: any = {
    id: "",
    approver: "",
    AssessmentYear: "",
    plstatusId: ""
  }

  //New PLRequest 
  newproposal: any = {
    userId: 1,
    assessmentYear: "2024-2025",
    plstatusId: 1,
    createdBy: 1
  }

  //Get ProposalList for the current userId
  proposalList: any = [];


  //Variable for Request PL for current assessment year 
  requestPL: boolean = true;

  ngOnInit(): void {
    this.getProposals(this.currentuserId);
  }

  getProposals(userId: number) {
    this.http.get(`http://localhost:5002/api/PL/GetallPLsByUserId/${this.currentuserId}`).subscribe((res) => {
      this.proposalList = res;
      console.log(res);
      this.proposalList.forEach((proposal: any) => {
        if (proposal.assessmentYear == "2024-2025") {
          this.requestPL = false;
        }
        this.http.get(`http://localhost:5002/api/PLStatus/${proposal.plstatusId}`).subscribe((statusData: any) => {
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
          window.location.replace('');
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
