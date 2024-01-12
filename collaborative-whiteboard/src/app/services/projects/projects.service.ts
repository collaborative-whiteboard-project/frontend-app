import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  projects: { name: string }[] = [
    { name: 'Diagram przypadków użycia' },
    { name: 'Diagram stanów' },
    { name: 'Diagram klas' },
    { name: 'Diagram klas' },
  ];
}
