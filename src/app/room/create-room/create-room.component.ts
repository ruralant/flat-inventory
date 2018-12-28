import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material'

import { RoomService } from 'app/services/room.service';
import { Room } from 'app/common/interface/room';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent {

  newRoom: Room = {}
  rooms: Room[] = [];
  constructor(
    private roomService: RoomService,
    private snackBar: MatSnackBar
  ) { }

  createRoom(): void {
    this.roomService.createRoom(this.newRoom)
      .subscribe((room: Room) => {
        if (room) {
          this.snackBar.open('The new room has been created')
        } else {
          this.snackBar.open('Something went wrong!')
        }
      });
  }

}
