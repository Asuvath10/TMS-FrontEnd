import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProposalLetterService } from '../proposal-letter.service';
import { UserService } from 'src/app/User/user.service';
import { LoginService } from 'src/app/login/login.service';
import { HotToastService } from '@ngneat/hot-toast';
import { DomSanitizer } from '@angular/platform-browser';
import { PLStatus } from 'src/app/Models/PLStatus';

@Component({
  selector: 'app-view-pl',
  templateUrl: './view-pl.component.html',
  styleUrls: ['./view-pl.component.css']
})
export class ViewPLComponent implements OnInit {
  // Enum plStatus
  plstatus = PLStatus;
  forms: any[] = [];
  SelectedForm: any;
  isApprover: boolean = false;
  userId = 0;
  userRole: string = '';
  proposalLetter: any;
  userDetails: any;
  eSigned: boolean = false;
  showImage: boolean = false
  PLforms: any = [];
  signImage: any;
  plId: number = 0;
  // Boolean for reviewer flow
  isReviewerLess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private plService: ProposalLetterService,
    private userService: UserService,
    public loginService: LoginService,
    private toastService: HotToastService,
    private router: Router,
    private sanitizer: DomSanitizer,

  ) { }

  ngOnInit(): void {
    this.plId = this.route.snapshot.params['PLId'];
    this.userId = this.loginService.getId();
    this.userRole = this.loginService.getRole();
    this.loadProposalLetter();
  }
  loadProposalLetter() {
    this.plService.getPLById(this.plId).subscribe(pl => {
      this.proposalLetter = pl;
      if (this.proposalLetter.plstatusId === this.plstatus.PendingApproval && (this.loginService.IsApprover)) {
        this.isApprover = true;
      }
      if (this.proposalLetter.approverSignUrl != null) {
        this.eSigned = true;
      }
      if (this.proposalLetter.reviewerId == null || this.proposalLetter.reviewerId === 0) {
        this.isReviewerLess = true;
      }
      this.loadUserDetails();
      this.loadFormDetails();
      if (this.eSigned) {
        this.loadESign();
      }
    });
  }

  loadUserDetails() {
    // Fetch user details related to the proposal letter
    this.userService.getUserById(this.proposalLetter.userId).subscribe(details => {
      this.userDetails = details;
    });
  }

  loadFormDetails() {
    //Fetch forms for the current pl
    this.plService.getallFormsByPLId(this.plId).subscribe((formdata: any) => {
      this.PLforms = formdata;
    });
  }
  loadESign() {
    this.showImage = true;
    var mediaType = 'image/png'
    if (this.proposalLetter.approverSignUrl != null) {
      this.plService.DownloadFile(this.proposalLetter.approverSignUrl).subscribe({
        next: (res) => {
          const blob = new Blob([res], { type: mediaType });
          const blobURL = URL.createObjectURL(blob);
          this.signImage = this.sanitizer.bypassSecurityTrustUrl(blobURL) as string;
        },
        error: (err => {
          console.error(err, "File not downloaded");
        })
      });
    }
  }
  sendBackToReviewer() {
    this.proposalLetter.plstatusId = this.plstatus.MovetoReview;
    this.plService.updatePL(this.proposalLetter.id, this.proposalLetter).subscribe({
      next: (res: any) => {
        this.toastService.success("Proposal Letter Sent Back To Reviewer");
        this.RoutetoPLList();
      },
      error: (err) => {
        this.toastService.error("Error on sending back PL to Reviewer");
      }
    });
  }
  sendBackToPreparer() {
    this.proposalLetter.plstatusId = this.plstatus.Preparing;
    this.proposalLetter.draft = false;
    this.plService.updatePL(this.proposalLetter.id, this.proposalLetter).subscribe({
      next: (res: any) => {
        this.toastService.success("Proposal Letter Sent Back To Preparer");
        this.RoutetoPLList();
      },
      error: (err) => {
        this.toastService.error("Error on sending back PL to Preparer");
        console.error("Error on updating", err);
      }
    });
  }
  ApproveProposalLetter() {
    this.proposalLetter.plstatusId = this.plstatus.Approved;
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
    this.router.navigate(['/PLList']);
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Call firebase cloud service with the byte array
      this.plService.UploadFile(file).subscribe({
        next: (res) => {
          this.proposalLetter.approverSignUrl = res.url;
          this.plService.updatePL(this.plId, this.proposalLetter).subscribe({
            next: () => {
              if (this.proposalLetter.approverSignUrl != null) {
                this.eSigned = true;
              }
              this.toastService.success("Proposal Letter Updated Successfully");
              this.loadESign();
            }
          });
        },
        error: (err) => {
          console.error('Upload error', err);
        }
      });
    } else {
      console.error('Please select a file to upload.');
    }
  }
}
