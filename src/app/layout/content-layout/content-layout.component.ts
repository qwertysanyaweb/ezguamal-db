import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CoreUsersService } from '../../core/services/core-users.service';

@Component({
  selector: 'app-content-layout',
  templateUrl: './content-layout.component.html',
  styleUrls: ['./content-layout.component.scss'],
})
export class ContentLayoutComponent implements OnInit {
  subscriptions: Subscription = new Subscription();

  openMenu: boolean = false;

  constructor(
    private readonly coreUsersService: CoreUsersService,
  ) {
  }

  ngOnInit() {
    this.subscriptions.add(
      this.coreUsersService.menuOpen$.subscribe((value) => {
        this.openMenu = value;
      }),
    );
  }

}
