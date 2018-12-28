import { Component, OnInit } from '@angular/core';
import { ItemService } from 'app/services/item.service';
import { Item } from '../common/interface/item';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss']
})
export class ItemComponent implements OnInit {

  items: Item[];

  constructor( private itemService: ItemService ) { }

  getItems() {
    this.itemService.getItems()
      .subscribe((items: Item[]) => this.items = items);
  }

  ngOnInit() {
    this.getItems();
  }
}
