import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PropertiesService } from 'src/app/services/properties/properties.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss'],
})
export class PropertiesComponent implements OnDestroy {
  elementSelected = false;
  elementPropertiesSub: Subscription;
  strokeWidth = '4';
  elementId = '';
  strokeColor = '#000000';
  fillColor = '#FFFFFF';
  clearSelectedSub: Subscription;
  constructor(private propertiesService: PropertiesService) {
    this.elementPropertiesSub =
      this.propertiesService.sendPropertiesEventEmmiter.subscribe(
        (properties) => {
          this.strokeWidth = properties['stroke-width'];
          this.strokeColor = properties.stroke;
          this.fillColor = properties.fill;
          this.elementId = properties.id;
          this.elementSelected = true;
        }
      );

    this.clearSelectedSub =
      this.propertiesService.clearSelectedEventEmmiter.subscribe(() => {
        this.elementSelected = false;
      });
  }
  ngOnDestroy(): void {
    this.clearSelectedSub.unsubscribe();
    this.elementPropertiesSub.unsubscribe();
  }

  onStrokeChange(value: string) {
    this.strokeWidth = value;
  }

  onStrokeColorChange(value: string) {
    this.strokeColor = value;
  }

  onFillColorChange(value: string) {
    this.fillColor = value;
  }

  onApply() {
    this.propertiesService.updatePropertiesEventEmmiter.next({
      id: this.elementId,
      'stroke-width': this.strokeWidth,
      stroke: this.strokeColor,
      fill: this.fillColor,
    });
  }
}
