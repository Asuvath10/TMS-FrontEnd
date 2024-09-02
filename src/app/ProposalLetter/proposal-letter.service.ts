import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  getAllPLByReviewerId(reviewerId: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/GetallPLByReviewerId/${reviewerId}`);
  }
  getAllPLByPreparerId(preparerId: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/GetallPLByPreparerId/${preparerId}`);
  }
  getAllPLByApproverId(approverId: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/GetallPLByApproverId/${approverId}`);
  }
  postPL(data: any): Observable<any> {
    return this.http.post<any>(baseurl + 'ProposalLetter', data);
  }
  updatePL(id: number, data: any): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.put<any>(baseurl + `ProposalLetter/${id}`, data);
  }
  DeletePL(id: number): Observable<any> {
    return this.http.delete<any>(baseurl + `ProposalLetter/${id}`);
  }
  getallFormsByPLId(PLid: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/FormByPLId/${PLid}`);
  }
  getFormById(id: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/Form/${id}`);
  }
  getAllFormss(id: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/GetallForms`)
  }
  CreateForm(data: any): Observable<any> {
    return this.http.post<any>(baseurl + 'ProposalLetter/CreateForm', data);
  }
  updateForm(data: any): Observable<any> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json; charset=utf-8');
    return this.http.put<any>(baseurl + 'ProposalLetter/UpdateForm', data);
  }
  DeleteForm(id: number): Observable<any> {
    return this.http.delete<any>(baseurl + `ProposalLetter/DeleteForm/${id}`);
  }
  getPLStatusbyId(id: number): Observable<any> {
    return this.http.get<any>(baseurl + `ProposalLetter/PLStatus/${id}`);
  }
  ExportPDF(PLid: number): Observable<Blob> {
    return this.http.get<Blob>(baseurl + `Document/GeneratePdf?plId=${PLid}`, { responseType: 'blob' as 'json' });
  }
  UploadFile(data: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', data);
    return this.http.put<any>(`https://localhost:5003/api/Document/upload`, data);
  }
  DownloadFile(fileUrl: string): Observable<Blob> {
    return this.http.get<Blob>(`https://localhost:5003/api/Document/download?fileUrl=${fileUrl}`, { responseType: 'blob' as 'json' });
  }

}
