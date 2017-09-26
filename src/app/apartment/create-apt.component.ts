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
    private snackbarService: SnackbarService    
  ) { }

  ngOnInit() {
  }

  createApartment(): void {
    this.apartmentService.createApartment(this.newApartment)
    .subscribe(apartment => {
      this.snackbarService.showSnackBar("The apartment has been created.");
    }), err => {
        if(err.status === 400) {
          // UIkit.notification(`An error occurred. The apartment has not been created`, { status: 'warning' });
        }
      }
  }

}
