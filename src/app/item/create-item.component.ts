import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { ApartmentService } from '../apartment.service';
import { SnackbarService } from '../snackbar.service';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {

  newItem: any = {};
  apartments: any = [];

  constructor(
    private itemService: ItemService,
    private apartmentService: ApartmentService,
    private snackbar: SnackbarService
  ) { }

  createItem(): void {
    this.itemService.createItem(this.newItem)
      .subscribe(item => {
        this.snackbar.showSnackBar(`The item has been created.`)
    }), err => {
        if(err.status === 400) {
          this.snackbar.showSnackBar(`An error occurred. The item has not been created`)
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

  ngOnInit() {
    this.getApartments();
  }

}
