import { Component, OnInit } from '@angular/core';

@Component({
  template: `
  <app-topnav>Loading...</app-topnav>
  <router-outlet></router-outlet>`
})
export class ApartmentSectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
