import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import { ApartmentService } from 'app/services/apartment.service';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent implements OnInit {

  apartmentId: string;
  apartment: any;
  items: any = [];

  constructor(
    private apartmentService: ApartmentService,
    private route: ActivatedRoute
  ) { }

  async getApartment() {
    await this.route.paramMap
      .subscribe(params => this.apartmentId = params.get('id'));
    await this.apartmentService.getOneApartment(this.apartmentId)
      .subscribe(response => this.apartment = response.apartments[0]);
  }

  ngOnInit() {
    this.getApartment();
  }

}
