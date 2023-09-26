import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Menu } from '../../../../core/interfaces/menu';
import { MENU_SIDEBAR } from '../../../../core/constants/menu.constants';
import { LanguageService } from '../../../../core/services/language.service';
import { CoreUsersService } from '../../../../core/services/core-users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  subscriptions: Subscription = new Subscription();

  userName: string = '';

  defaultMenuList: Menu[] = MENU_SIDEBAR;

  sidebarMenu: Menu[] = [];

  constructor(
    private readonly languageService: LanguageService,
    private readonly coreUsersService: CoreUsersService,
  ) {

  }

  ngOnInit() {
    this.getUserData();
  }

  getUserData() {
    this.subscriptions.add(
      this.coreUsersService.userData$.pipe().subscribe((user) => {
        this.userName = user.display_name;
        this.sidebarMenu = this.defaultMenuList;
        this.changeMenu(user.roles);
      }),
    );
  }

  changeMenu(rolesId: any) {
    this.sidebarMenu.forEach((item) => {
      this.openMenuItem(item, rolesId);
    });
    this.showParent();
  }

  openMenuItem(menuItem: Menu, rolesId: any) {
    const key: any = Object.keys(rolesId).find((k: string) => k === menuItem.id);
    if (menuItem.children != null) {
      menuItem.children.forEach((item: Menu) => {
        this.openMenuItem(item, rolesId);
      });
    }

    menuItem.hidden = rolesId[key] === null && undefined ? false : rolesId[key];
  }

  showParent() {
    this.sidebarMenu.forEach((item: Menu) => {
      if (!item.hidden && item.children) {
        if (item.children.find((item) => item.hidden === true)) {
          item.hidden = true;
        }
      }
    });
  }

}
