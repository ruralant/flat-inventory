import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { Room } from './../common/interface/room';
import { RoomService } from 'app/services/room.service';

@Injectable({ providedIn: 'root' })
export class RoomResolver implements Resolve<Room> {

  constructor( private roomService: RoomService ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Room> | Promise<Room> | Room {
    return this.roomService.getRoom(route.params['id']);
  }
}
