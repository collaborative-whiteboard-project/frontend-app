import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ProjectService } from 'src/app/services/projects/projects.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  items: MenuItem[] = [
    { label: 'My projects' } as MenuItem,
    { label: 'Shared projects' } as MenuItem,
  ];

  projects: { name: string }[] = [];

  constructor(private projectService: ProjectService) {}

  ngOnInit(): void {
    this.projects = this.projectService.projects;
  }
}
