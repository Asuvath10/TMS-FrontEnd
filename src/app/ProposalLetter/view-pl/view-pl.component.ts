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
  showImage: boolean = false
  PLforms: any = [];
  signImage: Blob[] = [];
  plId: number = 0;
  constructor(
    private route: ActivatedRoute,
    private plService: ProposalLetterService,
    private userService: UserService,
    public loginService: LoginService,
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
      if (this.proposalLetter.plstatusId === 4 && (this.loginService.IsApprover)) {
        this.isApprover = true;
      }
      if (this.proposalLetter.approverSignUrl != null) {
        this.eSigned = true;
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
      console.log(this.userDetails, "This is user")
    });
  }

  loadFormDetails() {
    //Fetch forms for the current pl
    this.plService.getallFormsByPLId(this.plId).subscribe((formdata: any) => {
      this.PLforms = formdata;
      console.log(this.PLforms, "This is form");
    });
  }
  loadESign() {
    this.showImage = true;
    console.log(this.proposalLetter.approverSignUrl);
    var mediaType = 'image/png'
    if (this.proposalLetter.approverSignUrl != null) {
      this.plService.DownloadFile(this.proposalLetter.approverSignUrl).subscribe({
        next: (res) => {

        },
        error: (err => {
          console.error(err, "File not downloaded");
        })
      });
    }
  }
  sendBackToReviewer() {
    this.proposalLetter.plstatusId = 3;
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
    this.router.navigate(['/PLList']);
  }

  uploadImage(event: any) {
    const file = event.target.files[0];
    console.log("Inside the file upload", file)
    if (file) {
      // const fileBytes = new Uint8Array(reader.result as ArrayBuffer);
      console.log(file.type, "Uploaded file type");
      // Call your upload service method with the byte array
      this.plService.UploadFile(file).subscribe({
        next: (res) => {
          console.log('File uploaded successfully', res.url);
          this.proposalLetter.approverSignUrl = res.url;
          this.plService.updatePL(this.plId, this.proposalLetter).subscribe({
            next: () => {
              if (this.proposalLetter.approverSignUrl != null) {
                this.eSigned = true;
              }
              this.toastService.success("Proposal Letter Updated Successfully");
            }
          });
        },
        error: (err) => {
          console.error('Upload error', err);
        }
      });


      // Read the file as an ArrayBuffer
      // reader.readAsArrayBuffer(file);
    } else {
      console.error('Please select a file to upload.');
    }
  }
}
