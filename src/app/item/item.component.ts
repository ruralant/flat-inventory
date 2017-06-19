import { Component, OnInit } from '@angular/core';

import { ItemService } from  '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {

  items: any = [];

  constructor(
    private itemService: ItemService,
  ) { }

  ngOnInit() {
    this.getItems();
  }

  getItems() {
    this.itemService.getItems()
      .subscribe(items => {
        this.items = items;
        console.log(this.items)
      })
  }
}
