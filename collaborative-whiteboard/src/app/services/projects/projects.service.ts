import { Injectable } from '@angular/core';
import { ProjectMemberRole } from 'src/app/enums/project-member-role.enum';
import { UserRole } from 'src/app/enums/user-role.enum';
import { Member } from 'src/app/models/project/member';
import { Project } from 'src/app/models/project/project';
import { User } from 'src/app/models/user/user';
import { AuthSerivce, UserDto } from '../auth/auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

export interface SimpleProjectDto {
  id: number;
  name: string;
  modifiedAt: Date;
  members: Member[];
}
@Injectable({ providedIn: 'root' })
export class ProjectService {
  apiUrl = 'http://localhost:8080/api/v1';

  constructor(private authService: AuthSerivce, private http: HttpClient) {}

  getAllProjects() {
    const jwt = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });

    return this.http.get<SimpleProjectDto[]>(this.apiUrl + '/project/all', {
      headers,
    });
  }

  getUserProjects() {
    const jwt = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });

    return this.http.get<SimpleProjectDto[]>(
      this.apiUrl + '/project/user/all',
      {
        headers,
      }
    );
  }

  createProject(projectName: string) {
    const jwt = this.authService.getToken();
    const body = { projectName: projectName };
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });
    return this.http.post<void>(
      this.apiUrl + '/project/create',
      JSON.stringify(body),
      { headers }
    );
  }

  changeProjectData(project: SimpleProjectDto) {
    const jwt = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });

    return this.http.patch<void>(
      this.apiUrl + `/project/${project.id}/change/data`,
      { projectName: project.name, members: project.members },
      { headers }
    );
  }

  deleteProject(id: number) {
    const jwt = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });

    return this.http.delete<void>(this.apiUrl + `/project/${id}/delete`, {
      headers,
    });
  }

  getProjectMembers(id: string) {
    const jwt = this.authService.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwt!}`,
    });

    return this.http.get<any[]>(this.apiUrl + `/project/${id}/members`, {
      headers,
    });
  }
}
