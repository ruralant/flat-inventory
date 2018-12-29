import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Room } from '../common/interface/room';


const constURL = `${environment.constURL}/api`;

@Injectable()
export class RoomService {

  constructor( private http: HttpClient ) { }

  private handleError(error): Promise<any> {
    return Promise.reject(error.message || error);
  }

  searchRooms(search: string) {
    const url = search != null ? `${constURL}/rooms/query${search}` : `${constURL}/rooms/`;
    return this.http.get<Room[]>(url);
  }

  getRooms() {
    return this.http.get<Room[]>(`${constURL}/rooms`);
  }

  getRoom(id: string) {
    return this.http.get<Room[]>(`${constURL}/rooms/query?_id=${id}`);
  }

  getRoomItems(id: string) {
    return this.http.get<Room>(`${constURL}/rooms/query?_id=${id}`);
  }

  createRoom(room: object) {
    return this.http.post<Room>(`${constURL}/rooms`, room);
  }

  editRoom(id: string, room: object) {
    return this.http.patch<Room>(`${constURL}/rooms/${id}`, room);
  }

  deleteRoom(id: string) {
    return this.http.delete<Room>(`${constURL}/rooms/${id}`);
  }

}
