import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-assign-user',
  templateUrl: './assign-user.component.html',
  styleUrls: ['./assign-user.component.css']
})
export class AssignUserComponent implements OnInit {

  constructor(
    private route: ActivatedRoute
  ) { }
  //Current PLID
  plId = 0;
  ngOnInit(): void {
    this.plId = this.route.snapshot.params['PLId'];
    console.log(this.plId);
  }
  
}
