import { Component, OnInit } from '@angular/core';
import { ProposalLetterService } from '../proposal-letter.service';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/login/login.service';
import { UserService } from 'src/app/User/user.service';
// import ClassicEditor, * as ClasicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-plcrud',
  templateUrl: './plcrud.component.html',
  styleUrls: ['./plcrud.component.css']
})
export class PLCRUDComponent implements OnInit {
  // public Editor=ClassicEditor;
  // public editorConfig:any;
  plId: number = 0;
  proposalLetter: any;
  userDetails: any;
  forms: any = [];
  userRole: string = '';
  userId = 0;
  isEditing: boolean = false;
  canESign: boolean = false;
  selectedform: any;
  
  constructor(
    private route: ActivatedRoute,
    private plService: ProposalLetterService,
    private loginservice: LoginService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    // this.editorConfig = {
    //   toolbar: ['heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote']
    // };
  
    this.plId = this.route.snapshot.params['PLId'];
    this.loadProposalLetter();
    this.userRole = this.loginservice.getRole();
    console.log(this.userRole);
    this.userId = this.loginservice.getId();
    console.log(this.userId);
  }

  loadProposalLetter(): void {
    this.plService.getPLById(this.plId).subscribe(pl => {
      this.proposalLetter = pl;
      console.log(pl, "This is pl");
      // this.forms = this.proposalLetter.forms || [];
      this.loadUserDetails();
      this.loadFormDetails();
      console.log(this.forms);
    });
  }

  loadUserDetails(): void {
    // Fetch user details related to the proposal letter
    this.userService.getUserById(this.userId).subscribe(details => {
      this.userDetails = details;
    });
  }

  loadFormDetails(): void {
    //Fetch forms for the current pl
    this.plService.getallFormsByPLId(this.plId).subscribe((f) => {
      this.forms = f;
    });
  }

  canEdit(): boolean {
    return (this.proposalLetter.status === 'preparing' && this.userRole === 'preparer') ||
      (this.proposalLetter.status === 'review' && this.userRole === 'reviewer');
  }

  canSendBack(): boolean {
    return this.proposalLetter.status === 'review' && this.userRole === 'reviewer';
  }

  canSendToApprover(): boolean {
    return this.proposalLetter.status === 'review' && this.userRole === 'reviewer';
  }

  canApprove(): boolean {
    return this.proposalLetter.status === 'pending approval' && this.userRole === 'approver';
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
  AddForm(): void {
    this.plService.CreateForm
  }
  editProposalLetter(): void {
    this.isEditing = !this.isEditing;
  }

  saveContent(): void {
    this.plService.updateForm(this.selectedform.Id, this.selectedform).subscribe(() => {
      this.isEditing = false;
    });
  }

  sendBackToPreparer(): void {
    this.proposalLetter.plstatusId = 2;
    this.plService.updatePL(this.proposalLetter.Id, this.proposalLetter).subscribe(() => {
      this.loadProposalLetter();
    });
  }

  sendToApprover(): void {
    this.proposalLetter.plstatusId = 4;
    this.canESign = true;
    this.plService.updatePL(this.proposalLetter.Id, this.proposalLetter).subscribe(() => {
      this.loadProposalLetter();
    });
  }

  approveProposalLetter(): void {
    this.proposalLetter.plstatusId = 5;
    this.plService.updatePL(this.proposalLetter.Id, this.proposalLetter).subscribe(() => {
      this.loadProposalLetter();
    });
  }
}
