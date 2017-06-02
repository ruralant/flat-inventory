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

  searchApartments(search): any {
    const url = search != null ? `${constURL}/apartments/query${search}` : `${constURL}/apartments/`;
    return this.http.get(url)
    .map(res => res.json().apartment)
    .catch(this.handleError)
  }

  getApartments(): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/apartments`, options)
    .map(res => res.json())
    .catch(this.handleError)
  }

  createApartment(apartment: object): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${constURL}/apartments`, apartment, options)
    .map(res =>  res.json().apartment )
    .catch(this.handleError)
  }

  editApartment(id: string, apartment: object): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(`${constURL}/apartments/${id}`, apartment, options)
    .map(res => res.json())
    .catch(this.handleError);
  }

  deleteApartment(id: string): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(`${constURL}/apartments/${id}`)
    .map(res => res.json())
    .catch(this.handleError);
  }

}
