import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { ApartmentService } from '../apartment.service';

declare const UIkit;

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.css']
})
export class CreateItemComponent implements OnInit {

  newItem: any = {};
  apartments: any = [];

  constructor(
    private itemService: ItemService,
    private apartmentService: ApartmentService
  ) { }

  ngOnInit() {
    this.getApartments();
  }

  createItem() {
    this.itemService.createItem(this.newItem)
      .subscribe(item => {
        UIkit.notification(`The item has been created.`, { status: 'success' });
    }), err => {
        if(err.status === 400) {
          UIkit.notification(`An error occurred. The item has not been created`, { status: 'warning' });
        }
      }
  }

  getApartments(): void {
    this.apartmentService.getApartments()
      .subscribe(apartments => {
        console.log(apartments);
        this.apartments = apartments;
      })
  }

}
