import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Box } from '../../interfaces/boxes';
import { BoxesService } from '../../services/boxes.service';
import { NotifierService } from 'angular-notifier';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-boxes-view',
  templateUrl: './boxes-view.component.html',
  styleUrls: ['./boxes-view.component.scss'],
})
export class BoxesViewComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  loadingData: boolean = true;

  id: number = Number(this.currentRoute.snapshot.paramMap.get('id'));

  boxInfo: Box = {
    id: this.id,
    box_number: '',
    box_address: '',
    box_phone: '',
    box_dataCreate: '',
    box_dataClose: '',
    region: [],
    brand: [],
    post_status: '',
    box_open: [],
    title: '',
    box_coordinates: '',
  };

  box_coordinates: number[] = [];

  constructor(
    private currentRoute: ActivatedRoute,
    private readonly boxesService: BoxesService,
    private readonly notifierService: NotifierService,
  ) {
  }

  ngOnInit(): void {
    this.getBox();
  }

  getBox() {
    this.subscriptions.add(
      this.boxesService.getList({ p: this.id }).subscribe((response) => {
        this.boxInfo = response.post[0];
        const cord = this.boxInfo.box_coordinates.split(',');
        this.box_coordinates = [Number(cord[0]), Number(cord[1])];
        this.loadingData = false;
      }, (err) => {
        this.notifierService.notify('error', err.error.message);
      }),
    );
  }

  numberWithCommas(amount?: string) {
    if (amount) {
      return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    } else {
      return 0;
    }
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
