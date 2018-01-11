import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';

import { environment } from './../environments/environment';

const constURL = `${environment.constURL}/api`;
const token = 'skip';

@Injectable()
export class ApartmentService {

  constructor( private http: Http ) { }

  // error handler
  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  searchApartments(search: string): any {
    const headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    const url = search != null ? `${constURL}/apartments/query${search}` : `${constURL}/apartments/`;
    return this.http.get(url)
      .map(res => res.json().apartment)
      .catch(this.handleError)
  }

  getApartments(): any {
    const headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/apartments`, options)
      .map(res => res.json())
      .catch(this.handleError)
  }

  getOneApartment(id: any): any {
    const headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/apartments/query?_id=${id}`, options)
      .map(res =>  res.json().apartments)
      .catch(this.handleError)
  }

  getApartmentItems(id: any): any {
    const headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/apartments/query?_id=${id}`, options)
      .map(res =>  res.json())
      .catch(this.handleError)
  }

  createApartment(apartment: object): any {
    const headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.post(`${constURL}/apartments`, apartment, options)
      .map(res =>  res.json().apartment )
      .catch(this.handleError)
  }

  editApartment(id: string, apartment: object): any {
    const headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.patch(`${constURL}/apartments/${id}`, apartment, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  deleteApartment(id: string): any {
    const headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete(`${constURL}/apartments/${id}`, options)
      .map(res => res.json())
      .catch(this.handleError);
  }
}