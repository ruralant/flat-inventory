import { Component, OnInit } from '@angular/core';
import { RoomService } from '../room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {

  rooms: any = []

  constructor(
    private roomService: RoomService
  ) { }

  ngOnInit() {
    this.getRooms();
  }

  getRooms() {
    this.roomService.getRooms()
      .subscribe(rooms => {
        this.rooms = rooms;
      })
  }

}
