import { Component, OnInit } from '@angular/core';
import { ItemService } from 'app/services/item.service';
import { Item } from '../common/interface/item';

@Component({
  selector: 'app-items-view',
  templateUrl: './items-view.component.html',
  styleUrls: ['./items-view.component.scss']
})
export class ItemsViewComponent implements OnInit {

  items: Item[];

  constructor( private itemService: ItemService ) { }

  ngOnInit() {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems()
      .subscribe((items: Item[]) => this.items = items);
  }

}
