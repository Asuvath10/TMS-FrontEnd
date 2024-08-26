import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalLetterService } from '../proposal-letter.service';
import { UserService } from 'src/app/User/user.service';
import { LoginService } from 'src/app/login/login.service';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-view-pl',
  templateUrl: './view-pl.component.html',
  styleUrls: ['./view-pl.component.css']
})
export class ViewPLComponent implements OnInit {
  forms: any[] = [];
  SelectedForm: any;
  isApprover: boolean = false;
  userId = 0;
  userRole: string = '';
  proposalLetter: any;
  userDetails: any;
  eSigned: boolean = false;
  PLforms: any = [];
  plId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private plService: ProposalLetterService,
    private userService: UserService,
    private loginService: LoginService,
    private toastService: HotToastService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.plId = this.route.snapshot.params['PLId'];
    this.userId = this.loginService.getId();
    this.userRole = this.loginService.getRole();
    console.log(this.userId);
    this.loadProposalLetter();
  }
  loadProposalLetter() {
    this.plService.getPLById(this.plId).subscribe(pl => {
      this.proposalLetter = pl;
      console.log(this.proposalLetter, "MyPL")
      if (this.proposalLetter.plstatusId === 4 && this.userRole === 'Approver') {
        this.isApprover = true;
      }
      // this.forms = this.proposalLetter.forms || [];
      this.loadUserDetails();
      this.loadFormDetails();
    });
  }

  loadUserDetails() {
    console.log(this.proposalLetter, "At user load");
    // Fetch user details related to the proposal letter
    this.userService.getUserById(this.proposalLetter.userId).subscribe(details => {
      this.userDetails = details;
    });
  }

  loadFormDetails() {
    //Fetch forms for the current pl
    console.log(this.plId);
    this.plService.getallFormsByPLId(this.plId).subscribe((formdata: any) => {
      this.PLforms = formdata;
      console.log(this.PLforms, "This is form");
    });
  }
  sendBackToReviewer() {
    this.proposalLetter.plstatusId = 3;
    console.log(this.proposalLetter, "Sending back to reviewer");
    this.plService.updatePL(this.proposalLetter.id, this.proposalLetter).subscribe({
      next: (res: any) => {
        this.toastService.success("Proposal Letter Sent Back To Reviewer");
        this.RoutetoPLList();
      },
      error: (err) => {
        this.toastService.error("Error on sending back PL to Reviewer");
        console.error("Error on updating", err);
      }
    });
  }
  ApproveProposalLetter() {
    this.proposalLetter.plstatusId = 5;
    this.plService.updatePL(this.proposalLetter.id, this.proposalLetter).subscribe({
      next: () => {
        this.toastService.success("Proposal Letter Approved Successfully");
        this.RoutetoPLList();
      },
      error: (err) => {
        this.toastService.error("Error on Approving PL");
        console.error("Error on updating", err);
      }
    });
  }
  RoutetoPLList() {
    setTimeout(() => {
      this.router.navigate(['/PLList']);
    }, 500);
  }
  uploadESign(event: any) {
    const file = event.target.files[0];

    // Validate the file type
    const validImageTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (file && validImageTypes.includes(file.type)) {
      const formData = new FormData();
      formData.append('eSign', file, file.name);

      // Send the formData to the backend
      this.http.post('your-api-endpoint-here', formData).subscribe({
        next: (response) => {
          console.log('Upload successful', response);
        },
        error: (err) => {
          console.error('Upload error', err);
        }
      });
    } else {
      console.error('Please upload a valid image file (PNG, JPG, JPEG).');
    }
  }
