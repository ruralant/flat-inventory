import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Data } from '@angular/router';

@Component({
  selector: 'app-apartment',
  templateUrl: './apartment.component.html',
  styleUrls: ['./apartment.component.scss']
})
export class ApartmentComponent implements OnInit {

  apartment: any;

  constructor( private route: ActivatedRoute ) { }

  ngOnInit() {
    this.route.data
      .subscribe((data: Data) => this.apartment = data['apartment']);
  }

}
