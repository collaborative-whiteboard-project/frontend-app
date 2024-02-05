import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { AuthSerivce } from 'src/app/services/auth/auth.service';
import { SocketService } from 'src/app/services/socket/socket.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss'],
})
export class EditorComponent implements OnInit {
  projectId: string = '';
  members: MenuItem[] = [];
  projectName: string = '';

  constructor(
    private socketService: SocketService,
    private authService: AuthSerivce,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.socketService.listenToConnectedMembers().subscribe({
      next: (members) => {
        this.members = [];
        members.forEach((member) => {
          this.members.push({
            label: `${member.memberEmail} ${member.memberRole}`,
          });
        });
      },
    });
  }

  ngOnInit(): void {
    this.projectId = String(this.activatedRoute.snapshot.params['id']);
    this.projectName = String(this.activatedRoute.snapshot.params['name']);
    this.projectName = this.projectName.replaceAll('_', ' ');
    this.socketService.joinProject(this.projectId);
  }

  onExitProject() {
    this.socketService.leaveProject(this.projectId);
    this.router.navigate(['/', 'dashboard']);
  }
}
