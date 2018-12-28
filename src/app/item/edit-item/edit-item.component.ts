import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { ItemService } from 'app/services/item.service';
import { Item } from '../../common/interface/item';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {

  itemToBeModified: Item;

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.paramMap
      .subscribe((params: Params) => {
        this.itemService.getOneItem(params.get('id'))
          .subscribe((item: Item[]) => this.itemToBeModified = item[0]);
      })
  }

}
