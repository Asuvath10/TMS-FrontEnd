import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistrationComponent } from './registration/registration.component';
import { PLListComponent } from './ProposalLetter/pllist/pllist.component';
import { MasterGuard } from './login/Guards/master.guard';
import { ApproverGuard } from './login/Guards/approver.guard';
import { PreparerGuard } from './login/Guards/preparer.guard';
import { UserGuard } from './login/Guards/User.guard';
import { ReviewerGuard } from './login/Guards/reviewer.guard';
import { ViewPLComponent } from './ProposalLetter/view-pl/view-pl.component';
import { AdminGuard } from './login/Guards/admin.guard';

const routes: Routes = [
  { path: "", redirectTo: "Login", pathMatch: "full" },
  { path: "Login", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "PLList", component: PLListComponent, canActivate: [MasterGuard], data: { guard: [ReviewerGuard, UserGuard, AdminGuard, PreparerGuard] } },
  { path: "ViewPL", component: ViewPLComponent },
  { path: "Registration", component: RegistrationComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
