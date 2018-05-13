import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class ItemService {

  constructor( private http: HttpClient ) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  getItems() {
    return this.http.get(`${constURL}/items`)
      .map(res => res)
      .catch(this.handleError)
  }

  getOneItem(id: any) {
    return this.http.get(`${constURL}/items/query?_id=${id}`)
      .map(res =>  res)
      .catch(this.handleError)
  }

  createItem(item: any) {
    return this.http.post(`${constURL}/items/`, item)
      .map(res => res)
      .catch(this.handleError)
  }

}
