import { Component, OnDestroy, OnInit } from '@angular/core';
import { DonateService } from '../../services/donate.service';
import { DonateStateService } from '../../services/donate-state.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-donate',
  templateUrl: './donate.component.html',
  styleUrls: ['./donate.component.scss'],
})
export class DonateComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  constructor(
    private readonly donateService: DonateService,
    private readonly donateStateService: DonateStateService,
  ) {
  }

  ngOnInit() {
    this.getCategory();
  }

  getCategory() {
    this.subscriptions.add(
      this.donateService.getCategory().subscribe((response) => {
        this.donateStateService.setDonateCategory(response);
      }),
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.donateStateService.resetRequestParams();
    this.donateStateService.resetPaginationParams();
  }
}
