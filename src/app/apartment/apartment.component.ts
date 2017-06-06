import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ApartmentService } from '../apartment.service';

declare var UIkit: any;


@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.css']
})
export class ApartmentComponent implements OnInit {

  apartment: any = {};
  items: any = [];

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.getApartment();
    this.getAptItems();
  }

  getApartment(): void {
    this.route.params
      .switchMap((params: Params) => this.apartmentService.getOneApartment(params['id']))
      .subscribe(result => {
        this.apartment = result[0];
      })
  }

  getAptItems(): void {
    this.route.params
      .switchMap((params: Params) => this.apartmentService.getApartmentItems(params['id']))
      .subscribe(result => {
        console.log(result);
        this.items = result;
      })
  }

}
