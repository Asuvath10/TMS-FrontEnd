import { Component, OnInit } from '@angular/core';
import { ProposalLetterService } from '../proposal-letter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { UserService } from 'src/app/User/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PLStatus } from 'src/app/Models/PLStatus';

// import ClassicEditor, * as ClasicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-plcrud',
  templateUrl: './plcrud.component.html',
  styleUrls: ['./plcrud.component.css']
})
export class PLCRUDComponent implements OnInit {
  plStatus = PLStatus;
  plId: number = 0;
  proposalLetter: any;
  userDetails: any;
  PLforms: any = [];
  forms: any = [];
  formGroupArray: FormGroup[] = [];
  userRole: string = '';
  userId = 0;
  isEditing: boolean = false;
  isPreparer: boolean = false;
  isReviewer: boolean = false;
  isApprover: boolean = false;
  isPreparerDraft: boolean = false;
  canESign: boolean = false;
  selectedform: any;
  isReviewerLess: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private plService: ProposalLetterService,
    private loginservice: LoginService,
    private userService: UserService,
    public toastService: HotToastService,
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.plId = this.route.snapshot.params['PLId'];
    this.loadProposalLetter();
    this.userRole = this.loginservice.getRole();
    this.userId = this.loginservice.getId();
  }

  loadProposalLetter() {
    this.plService.getPLById(this.plId).subscribe(pl => {
      this.proposalLetter = pl;
      console.log(this.proposalLetter);
      if (this.proposalLetter.plstatusId === PLStatus.Preparing && this.loginservice.IsPreparer) {
        this.isPreparer = true;
      }
      else if (this.proposalLetter.plstatusId === PLStatus.MovetoReview && this.loginservice.IsReviewer) {
        this.isReviewer = true;
      }
      else if (this.proposalLetter.plstatusId === PLStatus.PendingApproval && this.loginservice.IsApprover) {
        this.isApprover = true;
      }
      if (this.proposalLetter.reviewerId == null || this.proposalLetter.reviewerId === 0) {
        this.isReviewerLess = true;
      }
      this.loadUserDetails();
      this.loadFormDetails();
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
      this.initializeForms();
    });
  }
  initializeForms() {
    this.forms = this.PLforms;
    this.forms.forEach((form: any) => {
      const formGroup = this.fb.group({
        id: [form.id],
        name: [form.name],
        content: [form.content],
        plid: [form.plid]
      });

      this.formGroupArray.push(formGroup);
    });
  }
  saveForm(index: number) {
    var formData: any = this.formGroupArray[index].value;
    this.plService.updateForm(formData).subscribe({
      next: (res: any) => {
        this.toastService.success("Form saved successfully");
        this.formGroupArray[index].value.id = res;
        setTimeout(() => {
          window.location.replace(`/PLList/${this.plId}/PLcrud`);
        }, 350);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  deleteForm(index: number) {
    const formData = this.formGroupArray[index].value;
    this.plService.DeleteForm(formData.id).subscribe((res: any) => {
      this.toastService.success("Form Deleted successfully");
      setTimeout(() => {
        window.location.replace(`/PLList/${this.plId}/PLcrud`);
      }, 350);
    });
  }
  addNewForm() {
    this.forms.push({ name: '', content: '' });
    this.formGroupArray.push(this.fb.group({
      id: [0],
      name: [''],
      content: [''],
      plid: [this.plId]
    }));
  }

  RoutetoPLList() {
    this.router.navigate(['/PLList']);
  }
  SendtoReviewer() {
    this.proposalLetter.plstatusId = PLStatus.MovetoReview;
    this.proposalLetter.draft = 0;
    this.plService.updatePL(this.proposalLetter.id, this.proposalLetter).subscribe({
      next: (res: any) => {
        this.toastService.success("Proposal Letter Sent to Review");
        this.RoutetoPLList();
      },
      error: (err) => {
        this.toastService.error("Error on Updating Reviewed PL");
        console.error("Error on updating", err);
      }
    });
  }
  SendtoApprover() {
    this.proposalLetter.plstatusId = 4;
    this.proposalLetter.draft = 0;
    this.plService.updatePL(this.proposalLetter.id, this.proposalLetter).subscribe({
      next: (res: any) => {
        this.toastService.success("Proposal Letter Sent to Approver");
        this.RoutetoPLList();
      },
      error: (err) => {
        this.toastService.error("Error on updating pending approval PL");
        console.error("Error on updating", err);
      }
    });
  }
  sendBackToReviewer() {
    this.proposalLetter.plstatusId = 3;
    this.proposalLetter.draft = false;
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
  sendBackToPreparer() {
    this.proposalLetter.plstatusId = 2;
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
  SetAsDraft() {
    this.proposalLetter.draft = true;
    this.plService.updatePL(this.proposalLetter.id, this.proposalLetter).subscribe({
      next: () => {
        this.toastService.success("Proposal Letter Set to Draft");
        this.RoutetoPLList();
      },
      error: (err) => {
        this.toastService.error("Error on Set to draft PL");
        console.error("Error on updating", err);
      }
    });
  }
  LogOut() {
    localStorage.clear();
    this.router.navigate(['/Login']);
  }
}
