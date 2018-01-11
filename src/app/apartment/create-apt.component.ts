import { Component, OnInit } from '@angular/core';
import { ApartmentService } from '../apartment.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-apt',
  templateUrl: './create-apt.component.html',
  styleUrls: ['./create-apt.component.scss']
})
export class CreateAptComponent implements OnInit {

  newApartment: any = {}

  constructor(
    private apartmentService: ApartmentService,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
  }

  createApartment(): void {
    this.apartmentService.createApartment(this.newApartment)
    .subscribe(result => {
      if (result.status === 'success') {
        this.snackbar.open('The apartment has been created.');
      } else {
        this.snackbar.open('Somthing went wrong! The apartment has not been created');
      }
    });
  }

}
