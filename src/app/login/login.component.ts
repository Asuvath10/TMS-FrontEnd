import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { HttpClient } from '@angular/common/http';
import { FormControl, FormGroup, Validators, FormsModule } from '@angular/forms';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private toastService: HotToastService,
    private http: HttpClient
  ) { }

  //model for Login
  Login: any = {
    Email: '',
    Password: '',
  };

  //Login forms for validation
  loginform = new FormGroup({
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
  });

  //On Button click event
  OnSubmit() {
    this.http.post('http://localhost:5000/api/Authentication/login', this.Login).subscribe({
      next: (res: any) => {
        localStorage.setItem('Token', res.token);

        this.toastService.success('Loggedin Successfully');

        setTimeout(() => {
          window.location.replace('/PLList');
        }, 500);
      },

      error: (err: any) => {
        if (err['error'] == 'Unauthorized user') {
          this.toastService.error(err['error']);
        }
      },
    });
  }

}
