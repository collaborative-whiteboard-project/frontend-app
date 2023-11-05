import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SvgElementProperties } from 'src/app/shared/svg-element-properties.interface';

@Injectable({ providedIn: 'root' })
export class PropertiesService {
  clearSelectedEventEmmiter = new Subject<void>();
  updatePropertiesEventEmmiter = new Subject<SvgElementProperties>();
  sendPropertiesEventEmmiter = new Subject<SvgElementProperties>();
}
