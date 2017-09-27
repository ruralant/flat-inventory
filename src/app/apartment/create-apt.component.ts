import { Component, OnInit } from '@angular/core';
import { ApartmentService } from '../apartment.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-create-apt',
  templateUrl: './create-apt.component.html',
  styleUrls: ['./create-apt.component.scss']
})
export class CreateAptComponent implements OnInit {

  newApartment: any = {}  

  constructor(
    private apartmentService: ApartmentService,
    private snackbar: SnackbarService    
  ) { }

  ngOnInit() {
  }

  createApartment(): void {
    this.apartmentService.createApartment(this.newApartment)
    .subscribe(apartment => {
      this.snackbar.showSnackBar("The apartment has been created.");
    }), err => {
        if(err.status === 400) {
          this.snackbar.showSnackBar("Something went wrong!")
        }
      }
  }

}
