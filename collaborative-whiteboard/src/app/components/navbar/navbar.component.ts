import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  userLoggedIn = true;
  userSettingsVisible = false;
  isAdmin = false;

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
      command: this.signOutUser.bind(this),
    },
  ];

  showUserSettings() {
    this.userSettingsVisible = true;
  }

  closeUserSettings() {
    this.userSettingsVisible = false;
  }

  signOutUser() {}

  showAdminPanel() {}
}
