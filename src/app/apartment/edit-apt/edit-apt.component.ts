import { Apartment } from 'app/common/interface/apartment';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, Data } from '@angular/router';
import { MatSnackBar } from '@angular/material';

import { ApartmentService } from 'app/services/apartment.service';

@Component({
  selector: 'app-edit-apt',
  templateUrl: './edit-apt.component.html',
  styleUrls: ['./edit-apt.component.scss']
})
export class EditAptComponent implements OnInit {

  apartment: Apartment = {};

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar
  ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: Data) => this.apartment = data['apartment']);
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
