import { Component, OnInit } from '@angular/core';
import { RoomService } from '../room.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss']
})
export class CreateRoomComponent implements OnInit {

  newRoom: any = {}

  constructor(
    private roomService: RoomService,
    private snackbarService: SnackbarService
  ) { }

  ngOnInit() {
  }

  createRoom(): void {
    this.roomService.createRoom(this.newRoom)
      .subscribe(room => {
        this.snackbarService.showSnackBar("The new room has been created")
      }), err => {
        if(err.status === 400) {
          this.snackbarService.showSnackBar("Something went wrong!")
        }
      }
  }

}
