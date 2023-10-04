import { Component, OnDestroy, OnInit } from '@angular/core';
import { LANGUAGE } from '../../core/constants';
import { LanguageService } from '../../core/services/language.service';
import { CoreUsersService } from '../../core/services/core-users.service';
import { MENU_SIDEBAR } from '../../core/constants/menu.constants';
import { Menu } from '../../core/interfaces/menu';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  userName: string = '';

  language: string = this.languageService.getLang();

  languages = LANGUAGE;

  defaultMenuList: Menu[] = MENU_SIDEBAR;

  sidebarMenu: Menu[] = [];

  openMenu: boolean = false;

  userOpen: boolean = false;

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

  changeOpen(value: boolean) {
    this.openMenu = value;
    this.coreUsersService.setOpenMenu(value);
  }

  changeUserOpen(value: boolean) {
    this.userOpen = value;
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

  selectLanguage(value: string) {
    this.languageService.selectLang(value);
  }

  logoOut() {
    this.coreUsersService.logout();
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
