import { Component, OnInit } from '@angular/core';
import { ProposalLetterService } from '../proposal-letter.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { UserService } from 'src/app/User/user.service';
import { HotToastService } from '@ngneat/hot-toast';
import { FormBuilder, FormGroup } from '@angular/forms';
// import ClassicEditor, * as ClasicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-plcrud',
  templateUrl: './plcrud.component.html',
  styleUrls: ['./plcrud.component.css']
})
export class PLCRUDComponent implements OnInit {
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

  constructor(
    private route: ActivatedRoute,
    private plService: ProposalLetterService,
    private loginservice: LoginService,
    private userService: UserService,
    private toastService: HotToastService,
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
      if (this.proposalLetter.plstatusId === 2 && this.userRole === 'Preparer') {
        this.isPreparer = true;
      }
      else if (this.proposalLetter.plstatusId === 3 && this.userRole === 'Reviewer') {
        this.isReviewer = true;
      }
      else if (this.proposalLetter.plstatusId === 4 && this.userRole === 'Approver') {
        this.isApprover = true;
      }
      // this.forms = this.proposalLetter.forms || [];
      this.loadUserDetails();
      this.loadFormDetails();
      console.log(this.PLforms, "onload");
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
      console.log(this.PLforms, "load forms")
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
        }, 300);
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
      }, 300);
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
    setTimeout(() => {
      this.router.navigate(['/PLList']);
    }, 500);
  }
  SendtoReviewer() {
    this.proposalLetter.plstatusId = 3;
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
  sendBackToPreparer() {
    this.proposalLetter.plstatusId = 2;
    console.log(this.proposalLetter, "Sending back to Preparer");
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
    console.log(this.proposalLetter, "Set to draft");
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

  // exportDocument(): void {
  //   this.plService.exportProposalLetter(this.plId).subscribe(blob => {
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement('a');
  //     a.href = url;
  //     a.download = 'proposal-letter.pdf';
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //   });
  // }
  selectForm(formId: number): void {
    this.selectedform = this.forms.find((f: any) => f.id === formId);
  }

  editProposalLetter(): void {
    this.isEditing = !this.isEditing;
  }

  UploadEsign() {

  }
}
