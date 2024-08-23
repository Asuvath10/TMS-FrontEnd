import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { Observable } from 'rxjs';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root',
})
export class MasterGuard implements CanActivate {
  constructor(private auth: LoginService, private toast: HotToastService, private router: Router) { }

  private route!: ActivatedRouteSnapshot;
  private state!: RouterStateSnapshot;
  guards!: any;
  result: boolean = false;
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    this.route = route;
    this.state = state;
    this.guards = this.route.data['guard'];

    if (this.guards != null) {
      for (let i = 0; i < this.guards.length; i++) {
        let guard = new this.guards[i](this.auth);
        this.result = guard.canActivate(this.route, this.state);
        if (this.result) break;
        else continue;
      }
    }

    if (this.result) {
      return true;
    } else {
      this.toast.warning("You're Unauthorized");
      setTimeout(() => {
        this.router.navigate(['/Login']);
      }, 500);
      return false;
    }
  }
}
