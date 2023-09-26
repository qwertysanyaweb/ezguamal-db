import { Component, OnDestroy, OnInit } from '@angular/core';
import { BoxesStateService } from '../../services/boxes-state.service';
import { BoxesService } from '../../services/boxes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-boxes',
  templateUrl: './boxes.component.html',
  styleUrls: ['./boxes.component.scss'],
})
export class BoxesComponent implements OnDestroy, OnInit {
  subscriptions: Subscription = new Subscription();

  constructor(
    private readonly boxesStateService: BoxesStateService,
    private readonly boxesService: BoxesService,
  ) {
  }

  ngOnInit() {
    this.getCategory();
  }

  getCategory() {
    this.subscriptions.add(
      this.boxesService.getCategory().subscribe((response) => {
        this.boxesStateService.setCategory(response);
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.boxesStateService.resetRequestParams();
    this.boxesStateService.resetPaginationParams();
  }

}
