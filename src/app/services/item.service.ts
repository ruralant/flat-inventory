import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Item } from '../common/interface/item';


const constURL = `${environment.constURL}/api`;

@Injectable()
export class ItemService {

  constructor( private http: HttpClient ) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  getItems() {
    return this.http.get(`${constURL}/items`);
  }

  getOneItem(id: string) {
    return this.http.get(`${constURL}/items/query?_id=${id}`);
  }

  createItem(item: Item) {
    return this.http.post(`${constURL}/items/`, item);
  }

}
