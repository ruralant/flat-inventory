import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';

@Component({
  selector: 'app-items-view',
  templateUrl: './items-view.component.html',
  styleUrls: ['./items-view.component.scss']
})
export class ItemsViewComponent implements OnInit {

  items: any = [];

  constructor(
    private itemService: ItemService
  ) { }

  ngOnInit() {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems()
      .subscribe(items => {
        this.items = items;
        console.log(this.items);
      })
  }

}
