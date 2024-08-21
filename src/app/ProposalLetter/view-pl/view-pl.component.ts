import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProposalLetterService } from '../proposal-letter.service';

@Component({
  selector: 'app-view-pl',
  templateUrl: './view-pl.component.html',
  styleUrls: ['./view-pl.component.css']
})
export class ViewPLComponent implements OnInit {
  forms: any[]=[];
  SelectedForm: any;
  canEdit = false;
  constructor(
    private route:ActivatedRoute,
    private PLservice:ProposalLetterService
  ) { }
  
  ngOnInit(): void {
  }

}
