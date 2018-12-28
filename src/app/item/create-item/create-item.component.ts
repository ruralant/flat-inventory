import { Component, OnInit } from '@angular/core';
import { ItemService } from 'app/services/item.service';
import { ApartmentService } from '../../services/apartment.service';
import { Apartment } from 'app/common/interface/apartment';
import { Item } from '../../common/interface/item';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-create-item',
  templateUrl: './create-item.component.html',
  styleUrls: ['./create-item.component.scss']
})
export class CreateItemComponent implements OnInit {

  newItem: Item;
  apartments: Apartment[];

  constructor(
    private itemService: ItemService,
    private apartmentService: ApartmentService,
    private snackbar: MatSnackBar
  ) { }

  createItem(): void {
    this.itemService.createItem(this.newItem)
      .subscribe(() => {
        this.snackbar.open(`The item has been created.`)
    }, err => {
        if (err.status === 400) {
          this.snackbar.open(`An error occurred. The item has not been created`);
        }
      })
  }

  getApartments(): void {
    this.apartmentService.getApartments()
      .subscribe((apartments: Apartment[]) => this.apartments = apartments);
  }

  ngOnInit() {
    this.getApartments();
  }
}
