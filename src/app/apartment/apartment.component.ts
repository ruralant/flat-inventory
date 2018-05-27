import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


import { ApartmentService } from 'app/services/apartment.service';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent implements OnInit {

  apartment: any = {};
  items: any = [];

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute
  ) { }

  getApartment(): void {
    this.route.paramMap
      .subscribe(params => this.apartment = params.get('id'));
  }

  // getAptItems(): void {
  //   this.route.paramMap
  //     .switchMap((params: Params) => this.apartmentService.getApartmentItems(params['id']))
  //     .subscribe(result => { this.items = result })
  // }

  ngOnInit() {
    this.getApartment();
  }

}
