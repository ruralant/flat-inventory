import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';

import { RoomService } from 'app/services/room.service';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.scss']
})
export class EditRoomComponent implements OnInit {

  roomToBeModified: any = {}

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.params
      .map((params: Params) => this.roomService.getOneRoom(params['id']))
      .subscribe(result => this.roomToBeModified = result[0]);
  }

  updateRoom(id: any) {
    this.roomService.editRoom(id, this.roomToBeModified)
      .subscribe(result => {
        this.snackbar.open(`The room ${this.roomToBeModified.name} has been correctly modified`)
        this.location.back()
      }, err => {
        if (err.status === 400) { this.snackbar.open('Something went wrong') }
      });
  }

}
