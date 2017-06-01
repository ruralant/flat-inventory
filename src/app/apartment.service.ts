import { Injectable } from '@angular/core';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const constURL: string = `${environment.constURL}/api`;
const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).token : '';

@Injectable()
export class ApartmentService {

  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  searchApartments(search){
    const url = search != null ? `${constURL}/apartments/query${search}` : `${constURL}/apartments/`;
    return this.http.get(url)
    .map(res => res.json().apartment)
    .catch(this.handleError)
  }

  getApartments(){
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/apartments`, options)
    .map(res => res.json())
    .catch(this.handleError)
  }

}
