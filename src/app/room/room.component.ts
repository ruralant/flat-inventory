import { Component, OnInit } from '@angular/core';
import { RoomService } from 'app/services/room.service';
import { Room } from '../common/interface/room';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  rooms: Room[] = []

  constructor( private roomService: RoomService ) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    this.roomService.getRooms()
      .subscribe((rooms: Room[]) => this.rooms = rooms);
  }

}
