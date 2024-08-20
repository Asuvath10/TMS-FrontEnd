import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService implements HttpInterceptor {

  constructor() { }

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    req.clone(
      {
        setHeaders: {
          accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      }
      );
    return next.handle(req);
  }
}
