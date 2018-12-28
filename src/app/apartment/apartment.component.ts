import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';
import { Apartment } from './../common/interface/apartment';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent implements OnInit {

  apartment: Apartment;

  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: Data) => this.apartment = data['apartment']);
  }

}
