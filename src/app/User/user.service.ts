import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseurl } from 'src/URL';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    private http: HttpClient
  ) { }
  getUsersById(id: number) {
    return this.http.get(baseurl + `User/${id}`);
  }
  getAllUsers(id: number): Observable<any> {
    return this.http.get<any>(baseurl + `User/Users`)
  }
  postUser(data: any): Observable<any> {
    return this.http.post<any>(baseurl + 'User', data);
  }
  updateUser(id: number, data: any): Observable<any> {
    return this.http.put<any>(baseurl + `User/${id}`, data);
  }
  disableUser(id: number): Observable<any> {
    return this.http.put<any>(baseurl + `User/DisableUser/${id}`, null);
  }
}
