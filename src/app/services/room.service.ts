import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import 'rxjs/add/operator/map';

const constURL = `${environment.constURL}/api`;

@Injectable()
export class RoomService {

  constructor( private http: HttpClient ) { }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }

  searchRooms(search: string): any {
    const url = search != null ? `${constURL}/rooms/query${search}` : `${constURL}/rooms/`;
    return this.http.get<any>(url)
      .map(res => res.room)
      .catch(this.handleError)
  }

  getRooms(): any {
    return this.http.get(`${constURL}/rooms`)
      .map(res => res)
      .catch(this.handleError)
  }

  getOneRoom(id: any): any {
    return this.http.get<any>(`${constURL}/rooms/query?_id=${id}`)
      .map(res =>  res.room)
      .catch(this.handleError)
  }

  getRoomItems(id: any): any {
    return this.http.get(`${constURL}/rooms/query?_id=${id}`)
      .map(res =>  res)
      .catch(this.handleError)
  }

  createRoom(room: object): any {
    return this.http.post<any>(`${constURL}/rooms`, room)
      .map(res =>  res.room)
      .catch(this.handleError)
  }

  editRoom(id: string, room: object): any {
    return this.http.patch(`${constURL}/rooms/${id}`, room)
      .map(res => res)
      .catch(this.handleError);
  }

  deconsteRoom(id: string): any {
    return this.http.delete(`${constURL}/rooms/${id}`)
      .map(res => res)
      .catch(this.handleError);
  }

}
