import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AuthSerivce, UserDto } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  userLoggedIn = false;
  userSettingsVisible = false;
  isAdmin = false;
  adminPanelVisible = false;
  userFirstName: string = '';

  userMenuItems: MenuItem[] = [
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      command: this.showUserSettings.bind(this),
    },
    {
      visible: this.isAdmin,
      label: 'Admin panel',
      icon: 'pi pi-user-edit',
      command: this.showAdminPanel.bind(this),
    },
    {
      label: 'Sign out',
      icon: 'pi pi-sign-out',
      command: () => {
        this.authService.signOutEventEmitter.next();
      },
    },
  ];

  constructor(private authService: AuthSerivce, private router: Router) {}

  ngOnInit(): void {
    this.authService.userDataEventEmitter.subscribe((user: UserDto) => {
      if (user.role === 'ADMIN') {
        this.isAdmin = true;
        this.userMenuItems.at(1)!.visible = true;
      } else {
        this.isAdmin = false;
        this.userMenuItems.at(1)!.visible = false;
      }
      this.userLoggedIn = true;
      this.userFirstName = user.firstName;
    });

    this.authService.signOutEventEmitter.subscribe(() => {
      this.signOutUser();
    });

    const user = this.authService.getLogged();
    if (!!user) {
      if (user.role === 'ADMIN') {
        this.isAdmin = true;
        this.userMenuItems.at(1)!.visible = true;
      }
      this.userLoggedIn = true;
      this.userFirstName = user.firstName;
    }
  }

  showUserSettings() {
    this.userSettingsVisible = true;
    console.log(this.userSettingsVisible);
  }

  onUserSettingsClosed() {
    this.userSettingsVisible = false;
  }

  signOutUser() {
    this.userLoggedIn = false;
    this.userSettingsVisible = false;
    this.isAdmin = false;
    this.adminPanelVisible = false;
    this.router.navigate(['/']);
  }

  showAdminPanel() {
    this.adminPanelVisible = true;
  }
}
