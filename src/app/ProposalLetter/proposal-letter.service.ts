import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { baseurl } from 'src/URL';

@Injectable({
  providedIn: 'root'
})
export class ProposalLetterService {

  constructor(
    private http: HttpClient
  ) { }

  getPLById(id: number) {
    return this.http.get(baseurl + `ProposalLetter/${id}`);
  }
  getAllPL() {
    return this.http.get(baseurl + `ProposalLetter`);
  }
  getAllPLByUserId(userid: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/GetallPLByUserId?userid=${userid}`);
  }
  getAllPLByStatusId(statusid: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/GetallPLByStatusId/${statusid}`);
  }
  postPL(data: any): Observable<any> {
    return this.http.post<any>(baseurl + 'ProposalLetter', data);
  }
  updatePL(id: number, data: any): Observable<any> {
    return this.http.put<any>(baseurl + `ProposalLetter/${id}`, data);
  }
  DeletePL(id: number): Observable<any> {
    return this.http.delete<any>(baseurl + `ProposalLetter/${id}`);
  }
  getallFormsByPLId(PLid: number) {
    return this.http.get(baseurl + `ProposalLetter/FormByPLId/${PLid}`);
  }
  getFormById(id: number) {
    return this.http.get(baseurl + `ProposalLetter/Form/${id}`);
  }
  getAllFormss(id: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/GetallForms`)
  }
  CreateForm(data: any): Observable<any> {
    return this.http.post<any>(baseurl + 'ProposalLetter/CreateForm', data);
  }
  updateForm(id: number, data: any): Observable<any> {
    return this.http.put<any>(baseurl + `ProposalLetter/Updateform/${id}`, data);
  }
  DeleteForm(id: number): Observable<any> {
    return this.http.delete<any>(baseurl + `ProposalLetter/DeleteForm/${id}`);
  }
  getPLStatusbyId(id: number) {
    return this.http.get(baseurl + `ProposalLetter/PLStatus/${id}`);
  }
}
