import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-project-thumbnail',
  templateUrl: './project-thumbnail.component.html',
  styleUrls: ['./project-thumbnail.component.scss'],
})
export class ProjectThumbnailComponent {
  @Input() projectName: string = '';
  dropDownItems: MenuItem[] = [
    { label: 'Manage project', icon: 'pi pi-cog' },
    { label: 'Delete project', icon: 'pi pi-times' },
  ];

  constructor(private router: Router) {}
}
