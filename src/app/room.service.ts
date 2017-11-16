import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { environment } from './../environments/environment';
import 'rxjs/add/operator/map';

const constURL: string = `${environment.constURL}/api`;
const token = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')).token : '';

@Injectable()
export class RoomService {

  constructor(private http: Http) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  searchRooms(search: string): any {
    const url = search != null ? `${constURL}/rooms/query${search}` : `${constURL}/rooms/`;
    return this.http.get(url)
      .map(res => res.json().room)
      .catch(this.handleError)
  }

  getRooms(): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/rooms`, options)
      .map(res => res.json())
      .catch(this.handleError)
  }

  getOneRoom(id: any): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/rooms/query?_id=${id}`, options)
      .map(res =>  res.json().room)
      .catch(this.handleError)
  }

  getRoomItems(id: any): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.get(`${constURL}/rooms/query?_id=${id}`, options)
      .map(res =>  res.json())
      .catch(this.handleError)
  }

  createRoom(room: object): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.post(`${constURL}/rooms`, room, options)
      .map(res =>  res.json().room )
      .catch(this.handleError)
  }

  editRoom(id: string, room: object): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.patch(`${constURL}/rooms/${id}`, room, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  deleteRoom(id: string): any {
    let headers = new Headers({ 'Content-Type': 'application/json', 'x-auth': token });
    let options = new RequestOptions({ headers: headers });
    return this.http.delete(`${constURL}/rooms/${id}`)
      .map(res => res.json())
      .catch(this.handleError);
  }

}
