import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { JwtModule } from '@auth0/angular-jwt';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/Login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { PLListComponent } from './ProposalLetter/pllist/pllist.component';
import { DatePipe } from '@angular/common';
import { ViewPLComponent } from './ProposalLetter/view-pl/view-pl.component';
import { AuthService } from './login/auth.service';
import { PLCRUDComponent } from './ProposalLetter/plcrud/plcrud.component';
import { UserListComponent } from './User/user-list/user-list.component';
import { AssignUserComponent } from './User/assign-user/assign-user.component';
import { PLRequestListComponent } from './ProposalLetter/plrequest-list/plrequest-list.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
export function tokenGetter() {
  return localStorage.getItem("Token");
}
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    PLListComponent,
    ViewPLComponent,
    PLCRUDComponent,
    UserListComponent,
    AssignUserComponent,
    PLRequestListComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:5004", "localhost:5003"],
        disallowedRoutes: []
      }
    }),
    NoopAnimationsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthService,
      multi: true
    },
    DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
