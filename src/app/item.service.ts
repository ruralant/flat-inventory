import { Injectable } from '@angular/core';
import { Response, Http, Headers, RequestOptions } from '@angular/http';
import { environment } from './../environments/environment';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const constURL: string = `${environment.constURL}/api`;
const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).token : '';

@Injectable()
export class ItemService {

  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  getItems() {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/items`, options)
      .map(res => res.json())
      .catch(this.handleError)
  }

  getOneItem(id: any) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/items/query?_id=${id}`, options)
      .map(res =>  res.json())
      .catch(this.handleError)
  }

  createItem(item: any) {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${constURL}/items/`, options)
      .map(res => res.json())
      .catch(this.handleError)
  }

}
