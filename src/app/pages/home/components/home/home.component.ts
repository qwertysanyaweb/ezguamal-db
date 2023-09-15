import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor(
    private homeService: HomeService,
    private readonly notifierService: NotifierService,
  ) {
  }

  ngOnInit(): void {
  }

  get() {
    this.homeService.getUser().subscribe((response) => {
      this.notifierService.notify('success', response.display_name);
      console.log(response);
    });
  }

}
