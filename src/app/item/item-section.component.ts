import { Component, OnInit } from '@angular/core';

@Component({
  template: `
  <app-topnav>Loading...</app-topnav>
  <router-outlet></router-outlet>`
})
export class ItemSectionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
