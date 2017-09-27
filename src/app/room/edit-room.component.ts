import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { SnackbarService } from '../snackbar.service';

import { RoomService } from '../room.service';

@Component({
  selector: 'app-edit-room',
  templateUrl: './edit-room.component.html',
  styleUrls: ['./edit-room.component.css']
})
export class EditRoomComponent implements OnInit {

  roomToBeModified: any = {}

  constructor(
    private roomService: RoomService,
    private route: ActivatedRoute,
    private location: Location,
    private snackbar: SnackbarService
  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.roomService.getOneRoom(params['id']))
      .subscribe(result => this.roomToBeModified = result[0]) // check if this syntax is working
  }

  updateRoom(id: any) {
    this.roomService.editRoom(id, this.roomToBeModified)
      .subscribe(result => {
        this.snackbar.showSnackBar("The room has been modified.");        
        this.location.back();
      }, err => {
        if (err.status === 400) {
          this.snackbar.showSnackBar("Something went wrong!")          
        }
      });
  }

}
