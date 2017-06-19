import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';

import { ItemService } from '../item.service';

declare var UIkit: any;

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.css']
})
export class EditItemComponent implements OnInit {

  itemToBeModified: any = {};

  constructor(
    private itemService: ItemService,
    private route: ActivatedRoute,
    private location: Location

  ) { }

  ngOnInit() {
    this.route.params
      .switchMap((params: Params) => this.itemService.getOneItem(params['id']))
      .subscribe(result => {
        this.itemToBeModified = result[0];
      })
  }

}
