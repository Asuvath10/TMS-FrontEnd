import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { PLListComponent } from './ProposalLetter/pllist/pllist.component';

const routes: Routes = [
  { path: "", redirectTo: "PLList", pathMatch: "full" },
  { path: "Login", component: LoginComponent , canActivate :[]},
  { path: "login", component: LoginComponent },
  { path: "PLList", component: PLListComponent },
  { path: "Registration", component: RegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
