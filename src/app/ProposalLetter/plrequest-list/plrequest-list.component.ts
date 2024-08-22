import { Component, OnInit } from '@angular/core';
import { ProposalLetterService } from '../proposal-letter.service';
import { UserService } from 'src/app/User/user.service';

@Component({
  selector: 'app-plrequest-list',
  templateUrl: './plrequest-list.component.html',
  styleUrls: ['./plrequest-list.component.css']
})
export class PLRequestListComponent implements OnInit {

  constructor(
    private plservice: ProposalLetterService,
    private userservice: UserService) { }
  PLList: any = [];

  ngOnInit(): void {
    this.getrequestedPL();
  }

  getrequestedPL(): void {
    //Getting the new request pl 
    this.plservice.getAllPLByStatusId(1).subscribe(res => {
      this.PLList = res;
      this.PLList.forEach((proposal: any) =>
        this.userservice.getUserById(proposal.userId).subscribe((userDetails: any) => {
          proposal.userId = userDetails.name;
        })
      )
    },
      (error) => {
        console.error("Error fetching proposals", error);
      }
    );
  }
}
