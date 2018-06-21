import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Data } from '@angular/router';

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

  ngOnInit() {
    this.route.data
      .subscribe((data: Data) => this.apartment = data['apartment']);
  }

}
