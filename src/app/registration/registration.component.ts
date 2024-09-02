import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {

  constructor(
    private toastService: HotToastService,
    private http: HttpClient,
    private router: Router
  ) { }

  //model for Registration
  Registration: any = {
    Name: '',
    FullName: '',
    Email: '',
    Password: '',
    Address: '',
    Pan: '',
  };

  Registrationform = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30)
    ]),
    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(30),
      Validators.pattern(
        '^([0-9a-z.]){3,}@[a-z]{3,}(.[a-z]{2,}[a-z]*){0,}$'
      ),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.maxLength(20),
      Validators.minLength(3),
    ]),
    address: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(1000)
    ]),
    pan: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(20)
    ]),
  });

  //On Button click event
  OnSubmit() {
    this.http.post('https://localhost:5005/api/Registration', this.Registration).subscribe({
      next: (res: any) => {
        this.toastService.success('User Registered Successfully');
        window.location.replace('Login');
      },

      error: (err: any) => {
        if (err['error'] == 'error') {
          this.toastService.error(err['error']);
        }
      }
    });
  }
}
