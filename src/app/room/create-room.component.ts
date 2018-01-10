import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material'

import { RoomService } from '../room.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  newRoom: any = {}

  constructor(
    private roomService: RoomService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  createRoom(): void {
    this.roomService.createRoom(this.newRoom)
      .subscribe(room => {
        this.snackBar.open("The new room has been created")
      }), err => {
        if(err.status === 400) { this.snackBar.open("Something went wrong!") }
      }
  }

}
