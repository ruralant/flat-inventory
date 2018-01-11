import { Component, OnInit } from '@angular/core';

import { ItemService } from '../item.service';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  items: any = [];

  constructor(
    private itemService: ItemService,
  ) { }

  getItems() {
    this.itemService.getItems()
      .subscribe(items => { this.items = items })
  }

  ngOnInit() {
    this.getItems();
  }
}
