import { Apartment } from './../common/interface/apartment';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { ApartmentService } from 'app/services/apartment.service';

@Component({
  selector: 'app-edit-apt',
  templateUrl: './edit-apt.component.html',
  styleUrls: ['./edit-apt.component.scss']
})
export class EditAptComponent implements OnInit {

  apartmentToBeModified: string;
  apartment = {};

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  async getApartment() {
    await this.route.params
      .subscribe((params: Params) => this.apartmentToBeModified = params['id']);
    await this.apartmentService.getApartment(this.apartmentToBeModified)
      .subscribe((apartment: Apartment) => this.apartment = apartment);
  }

  ngOnInit() {
    this.getApartment();
  }

  apartmentUpdate(id: string) {
    this.apartmentService.editApartment(id, this.apartment)
      .subscribe((apartment: Apartment) => {
        if (apartment) {
          this.snackbar.open('The apartment has been modified.', 'CLOSE', { duration: 1000 });
          this.router.navigate(['../'], { relativeTo: this.route })
        } else {
          this.snackbar.open('Something went wrong!');
        }
      });
  }
}
